export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 12 || digits.length > 14) throw new Error('Telefone deve incluir DDI + DDD');
  return digits;
}

export function buildWhatsappLink(phone: string, message: string) {
  const normalized = normalizePhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
