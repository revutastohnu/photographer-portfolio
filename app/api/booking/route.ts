import { NextRequest, NextResponse } from 'next/server';
import { BookingFormData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const data: BookingFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.sessionType || !data.selectedSlot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: In production, this would:
    // 1. Create event in Google Calendar
    // 2. Process payment via Stripe/LiqPay/WayForPay
    // 3. Send confirmation emails
    // 4. Store booking in database

    // For MVP: Just log and return success
    console.log('📸 New booking request:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      sessionType: data.sessionType,
      slot: data.selectedSlot,
      note: data.note,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Booking request received successfully',
      bookingId: `temp-${Date.now()}`,
    });
  } catch (error: any) {
    console.error('Error processing booking:', error);
    return NextResponse.json(
      { error: 'Failed to process booking', details: error.message },
      { status: 500 }
    );
  }
}
