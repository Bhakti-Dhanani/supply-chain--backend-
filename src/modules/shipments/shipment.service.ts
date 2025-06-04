import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment, ShipmentStatus } from './shipment.entity';
import { ShipmentStatusHistory } from '../shipment-status-history/shipment-status-history.entity';
import { Transporter } from '../transporters/transporter.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { User } from '../users/user.entity'; // Import User entity
import { UserRole } from '../users/user.entity'; // Import UserRole enum
import { Order } from '../orders/order.entity'; // Import Order entity
import { OrderStatus } from '../orders/order.entity'; // Import OrderStatus enum
import { Product } from '../products/product.entity'; // Import Product entity
import { StockMovement } from '../stock-movements/stock-movement.entity'; // Import StockMovement entity
import { MovementType } from '../stock-movements/stock-movement.entity'; // Import MovementType enum


@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(ShipmentStatusHistory)
    private readonly statusHistoryRepository: Repository<ShipmentStatusHistory>,
    @InjectRepository(Transporter)
    private readonly transporterRepository: Repository<Transporter>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User) // Inject User repository
    private readonly userRepository: Repository<User>,
  ) {}

  async getShipmentDetails(id: number) {
    const shipment = await this.shipmentRepository.findOne({ where: { id }, relations: ['transporter', 'vehicle'] });
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return {
      id: shipment.id,
      orderId: shipment.order.id,
      transporter: shipment.transporter?.id, // Updated to use transporter ID instead of company_name
      vehicle: shipment.vehicle?.plate_number,
      routeLog: [], // Add route log if available
      statusHistory: [], // Add status history if available
    };
  }

  async createShipment(createShipmentDto: CreateShipmentDto) {
    // Implement logic to create a shipment
  }

  async updateShipmentStatus(id: number, updateShipmentStatusDto: UpdateShipmentStatusDto) {
    // Implement logic to update shipment status
  }

  async createShipmentWithVehicleSelection(createShipmentDto: CreateShipmentDto) {
    const { orderId, vehicleId } = createShipmentDto;

    // Ensure type conversion for orderId and vehicleId
    const parsedOrderId = Number(orderId);
    const parsedVehicleId = Number(vehicleId);

    if (isNaN(parsedOrderId) || isNaN(parsedVehicleId)) {
      throw new BadRequestException('Invalid orderId or vehicleId');
    }

    // Fetch transporter using userId
    const transporter = await this.transporterRepository.findOne({ where: { user: { id: createShipmentDto.userId } }, relations: ['user'] });
    if (!transporter) {
      throw new NotFoundException(`Transporter with user ID ${createShipmentDto.userId} not found`);
    }

    // Validate vehicle
    const vehicle = await this.vehicleRepository.findOne({ where: { id: parsedVehicleId, transporter: { id: transporter.id } } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found for transporter ID ${transporter.id}`);
    }

    // Fetch and update order
    const order = await this.shipmentRepository.manager.findOne(Order, {
      where: { id: parsedOrderId },
      relations: ['warehouse', 'warehouse.location', 'location', 'orderItems', 'orderItems.product'], // Added 'warehouse.location' relation to fetch warehouse location
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    if (!order.location) {
      throw new NotFoundException(`Location not found for Order ID ${orderId}`);
    }
    if (!order.warehouse || !order.warehouse.location) {
      throw new NotFoundException(`Warehouse location not found for Order ID ${orderId}`);
    }
    order.status = OrderStatus.SHIPPED;
    await this.shipmentRepository.manager.save(order);

    // Create shipment with status 'In Transit'
    const shipment = this.shipmentRepository.create({
      order,
      transporter,
      vehicle,
      status: ShipmentStatus.IN_TRANSIT,
    });
    await this.shipmentRepository.save(shipment);

    // Create stock movement entries and update product quantities
    for (const item of order.orderItems) {
      const product = await this.shipmentRepository.manager.findOne(Product, { where: { id: item.product.id } }); // Corrected to use item.product.id
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.product.id} not found`);
      }

      // Create stock movement entry
      const stockMovement = this.shipmentRepository.manager.create(StockMovement, {
        product,
        warehouse: order.warehouse,
        quantity: item.quantity,
        movement_type: MovementType.OUT,
      });
      await this.shipmentRepository.manager.save(stockMovement);

      // Update product quantity
      product.quantity -= item.quantity;
      await this.shipmentRepository.manager.save(product);
    }

    // Return shipment details
    return {
      shipmentId: shipment.id,
      vehicle: {
        plateNumber: vehicle.plate_number,
        type: vehicle.type,
      },
      transporter: {
        userName: transporter.user.name,
      },
      warehouse: order.warehouse.location,
      deliveryLocation: order.location,
    };
  }

  async getAllShipments() {
    return this.shipmentRepository.find({
      relations: ['order', 'vehicle', 'transporter', 'order.warehouse', 'order.location'],
    });
  }
}
