/**
 * Formata valores monetários de forma inteligente para marketing
 * Exemplo: 500000 -> "R$ 500 mil", 1200000 -> "R$ 1,2 milhão"
 */
export function formatCurrency(value: number): string {
  if (value === 0) return 'R$ 0';
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1000000) {
    const millions = value / 1000000;
    // Format with 1 decimal place if needed
    const formatted = millions % 1 === 0 
      ? millions.toFixed(0) 
      : millions.toFixed(1).replace('.', ',');
    return `R$ ${formatted} ${millions === 1 || millions === -1 ? 'milhão' : 'milhões'}`;
  }
  
  if (absValue >= 1000) {
    const thousands = value / 1000;
    // Format with 1 decimal place if needed
    const formatted = thousands % 1 === 0 
      ? thousands.toFixed(0) 
      : thousands.toFixed(1).replace('.', ',');
    return `R$ ${formatted} mil`;
  }
  
  return `R$ ${value.toLocaleString('pt-BR')}`;
}

/**
 * Formata valor para labels de slider (versão curta)
 */
export function formatCurrencyShort(value: number): string {
  if (value === 0) return 'R$ 0';
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1000000) {
    const millions = value / 1000000;
    const formatted = millions % 1 === 0 
      ? millions.toFixed(0) 
      : millions.toFixed(1).replace('.', ',');
    return `R$ ${formatted}M`;
  }
  
  if (absValue >= 1000) {
    const thousands = value / 1000;
    const formatted = thousands % 1 === 0 
      ? thousands.toFixed(0) 
      : thousands.toFixed(1).replace('.', ',');
    return `R$ ${formatted}k`;
  }
  
  return `R$ ${value}`;
}

/**
 * Formata valor completo (sem abreviação)
 */
export function formatCurrencyFull(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR')}`;
}
