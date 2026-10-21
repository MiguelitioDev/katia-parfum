/**
 * Configurações da marca KatiaParfum e canais de atendimento.
 * Substitua os valores placeholder pelas informações de contato reais da KatiaParfum.
 */
export const siteConfig = {
  brand: 'KatiaParfum',
  whatsapp: '55XXXXXXXXXXX', // Preencher com o número do WhatsApp com DDI e DDD (ex: 5511999999999)
  instagram: 'katiaparfum', // Preencher com o usuário do Instagram sem @
  hours: 'Segunda a sexta, das 9h às 19h',
} as const;

export type SiteConfig = typeof siteConfig;
