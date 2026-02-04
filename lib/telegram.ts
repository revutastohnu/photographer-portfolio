/**
 * Telegram Bot API utilities
 * Для відправки сповіщень про бронювання
 */

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disable_web_page_preview?: boolean;
}

export class TelegramBot {
  private botToken: string;
  private chatId: string;
  private baseUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Перевірка чи налаштований Telegram бот
   */
  isConfigured(): boolean {
    return !!this.botToken && !!this.chatId;
  }

  /**
   * Відправка повідомлення в Telegram
   */
  async sendMessage(text: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Telegram bot is not configured. Skipping notification.');
      return false;
    }

    try {
      const message: TelegramMessage = {
        chat_id: this.chatId,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      };

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Telegram API error:', error);
        return false;
      }

      console.log('✅ Telegram notification sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      return false;
    }
  }

  /**
   * Форматоване повідомлення про нове бронювання
   */
  formatBookingNotification(booking: {
    name: string;
    email: string;
    phone?: string;
    sessionType: string;
    selectedSlot: Date;
    note?: string;
    amount: number;
    status: string;
  }): string {
    const date = booking.selectedSlot.toLocaleDateString('uk-UA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const time = booking.selectedSlot.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
🎉 <b>Нове бронювання фотосесії!</b>

👤 <b>Клієнт:</b> ${this.escapeHtml(booking.name)}
📧 <b>Email:</b> ${this.escapeHtml(booking.email)}
${booking.phone ? `📱 <b>Телефон:</b> ${this.escapeHtml(booking.phone)}\n` : ''}
📸 <b>Тип зйомки:</b> ${this.escapeHtml(booking.sessionType)}

📅 <b>Дата:</b> ${date}
⏰ <b>Час:</b> ${time}

💰 <b>Сума:</b> ${booking.amount} грн
${booking.status === 'confirmed' ? '✅ <b>Статус:</b> Підтверджено та оплачено' : '⏳ <b>Статус:</b> Очікує оплати'}

${booking.note ? `💭 <b>Нотатка:</b>\n${this.escapeHtml(booking.note)}` : ''}
    `.trim();
  }

  /**
   * Форматоване повідомлення про успішну оплату
   */
  formatPaymentNotification(booking: {
    name: string;
    sessionType: string;
    selectedSlot: Date;
    amount: number;
  }): string {
    const date = booking.selectedSlot.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
    });

    const time = booking.selectedSlot.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
💳 <b>Оплату підтверджено!</b>

👤 ${this.escapeHtml(booking.name)}
📸 ${this.escapeHtml(booking.sessionType)}
📅 ${date} о ${time}
💰 ${booking.amount} грн

✅ Бронювання підтверджено!
    `.trim();
  }

  /**
   * Екранування HTML спецсимволів для Telegram
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

// Singleton instance
export const telegramBot = new TelegramBot();
