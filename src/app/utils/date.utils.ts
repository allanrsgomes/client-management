// src/app/utils/date.utils.ts

export class DateUtils {
  /**
   * Calcula quantos dias faltam até uma data
   */
  static getDaysUntilDate(dateString: string | undefined): number {
    if (!dateString) return Infinity;

    const targetDate = new Date(dateString);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Formata data para padrão brasileiro (dd/MM/yyyy)
   */
  static formatToBrazilian(dateString: string | undefined): string {
    if (!dateString) return 'Sem data';

    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Converte data do input (yyyy-MM-dd) para ISO string (para salvar no banco)
   */
  static toISOString(dateString: string | undefined): string {
    if (!dateString) return '';

    // Se já está no formato ISO, retorna
    if (dateString.includes('T')) {
      return dateString;
    }

    // Converte yyyy-MM-dd para ISO
    const date = new Date(dateString + 'T00:00:00');
    return date.toISOString();
  }

  /**
   * Converte ISO string para formato do input (yyyy-MM-dd)
   */
  static toInputFormat(isoString: string | undefined): string {
    if (!isoString) return '';

    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Obtém data atual no formato ISO
   */
  static getCurrentISODate(): string {
    return new Date().toISOString();
  }

  /**
   * Obtém data atual no formato para input (yyyy-MM-dd)
   */
  static getCurrentInputDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Retorna texto descritivo dos dias restantes
   */
  static getExpiryText(days: number): string {
    if (days === Infinity) return 'Sem data';
    if (days < 0) return `Vencido há ${Math.abs(days)} dia(s)`;
    if (days === 0) return 'Vence hoje';
    if (days === 1) return 'Vence amanhã';
    return `${days} dia(s)`;
  }

  /**
   * Retorna classe CSS baseada nos dias restantes
   */
  static getExpiryClass(days: number): string {
    if (days === Infinity) return 'no-date';
    if (days < 0) return 'expired';
    if (days === 0) return 'expires-today';
    if (days <= 3) return 'expires-soon';
    if (days <= 7) return 'expires-week';
    return 'expires-normal';
  }

  /**
   * Retorna ícone baseado nos dias restantes
   */
  static getExpiryIcon(days: number): string {
    if (days === Infinity) return 'event_busy';
    if (days < 0) return 'error';
    if (days === 0 || days <= 3) return 'warning';
    if (days <= 7) return 'schedule';
    return 'check_circle';
  }
}
