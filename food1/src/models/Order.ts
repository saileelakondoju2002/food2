export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  createdAt: Date;
  estimatedDeliveryTime?: Date;
  specialInstructions?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export class OrderBuilder {
  private order: Partial<Order> = {
    items: [],
    subtotal: 0,
    deliveryFee: 5.99,
    total: 0,
    status: 'pending',
    paymentStatus: 'pending'
  };

  setUserId(userId: string): OrderBuilder {
    this.order.userId = userId;
    return this;
  }

  setItems(items: OrderItem[]): OrderBuilder {
    this.order.items = items;
    this.order.subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    this.order.total = (this.order.subtotal || 0) + (this.order.deliveryFee || 0);
    return this;
  }

  setDeliveryAddress(address: DeliveryAddress): OrderBuilder {
    this.order.deliveryAddress = address;
    return this;
  }

  setPaymentMethod(method: string): OrderBuilder {
    this.order.paymentMethod = method;
    return this;
  }

  setSpecialInstructions(instructions: string): OrderBuilder {
    this.order.specialInstructions = instructions;
    return this;
  }

  build(): Order {
    if (!this.order.userId || !this.order.items || !this.order.deliveryAddress || !this.order.paymentMethod) {
      throw new Error('Missing required order fields');
    }

    return {
      ...this.order,
      createdAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 minutes from now
    } as Order;
  }
}