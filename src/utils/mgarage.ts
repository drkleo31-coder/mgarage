export type ServiceId = 'lavagem' | 'higienizacao' | 'polimento' | 'protecao';

export interface ServiceItem {
  id: ServiceId;
  index: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  whatsappMessage: string;
}

export const WHATSAPP_NUMBER = '5515991223984';
export const WHATSAPP_DISPLAY = '(15) 99122-3984';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const SERVICES: readonly ServiceItem[] = [
  {
    id: 'lavagem',
    index: '01',
    title: 'Lavagem',
    description: 'Completa por fora e por dentro.',
    image: '/src/assets/images/service_lavagem_1795645669144.jpg',
    imageAlt: 'Veículo esportivo escuro recebendo lavagem detalhada completa por fora e por dentro no estúdio M Garage',
    whatsappMessage:
      'Olá, M Garage! Gostaria de solicitar um orçamento para o serviço de Lavagem (Completa por fora e por dentro).',
  },
  {
    id: 'higienizacao',
    index: '02',
    title: 'Higienização',
    description: 'Interna completa.',
    image: '/src/assets/images/service_higienizacao_1795645670230.jpg',
    imageAlt: 'Interior automotivo de alto padrão higienizado com acabamento impecável em couro escuro e detalhes dourados',
    whatsappMessage:
      'Olá, M Garage! Gostaria de solicitar um orçamento para o serviço de Higienização (Interna completa).',
  },
  {
    id: 'polimento',
    index: '03',
    title: 'Polimento',
    description: 'Brilho intenso e remoção de imperfeições.',
    image: '/src/assets/images/service_polimento_1795645669712.jpg',
    imageAlt: 'Polimento técnico em lataria preta espelhada com reflexos dourados de iluminação de estúdio',
    whatsappMessage:
      'Olá, M Garage! Gostaria de solicitar um orçamento para o serviço de Polimento (Brilho intenso e remoção de imperfeições).',
  },
  {
    id: 'protecao',
    index: '04',
    title: 'Proteção',
    description: 'Produtos de alta qualidade que protegem e valorizam seus veículos.',
    image: '/src/assets/images/service_protecao_1795645670429.jpg',
    imageAlt: 'Gotículas uniformes sobre lataria protegida com brilho intenso e reflexo dourado',
    whatsappMessage:
      'Olá, M Garage! Gostaria de solicitar um orçamento para o serviço de Proteção para o meu veículo.',
  },
] as const;

export function buildWhatsAppUrl(serviceId?: ServiceId): string {
  if (!serviceId) {
    const defaultMsg =
      'Olá, M Garage! Gostaria de conversar sobre os serviços de estética automotiva para o meu veículo.';
    return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(defaultMsg)}`;
  }

  const found = SERVICES.find((s) => s.id === serviceId);
  if (!found) {
    return WHATSAPP_BASE_URL;
  }
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(found.whatsappMessage)}`;
}

export type FinishModeId = 'original' | 'polimento' | 'protecao' | 'dourado';
export type CameraPresetId = 'threeQuarter' | 'profile' | 'rear';

export interface FinishPreset {
  id: FinishModeId;
  label: string;
  subtitle: string;
  bodyColor: number;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  rimLightIntensity: number;
  linkedService?: ServiceId;
}

export const FINISH_PRESETS: readonly FinishPreset[] = [
  {
    id: 'original',
    label: 'Obsidiana',
    subtitle: 'Preto profundo metálico de estúdio',
    bodyColor: 0x0b0b0e,
    metalness: 0.72,
    roughness: 0.28,
    clearcoat: 0.7,
    clearcoatRoughness: 0.16,
    rimLightIntensity: 1.4,
    linkedService: 'lavagem',
  },
  {
    id: 'polimento',
    label: 'Polimento Espelhado',
    subtitle: 'Brilho intenso e remoção de imperfeições',
    bodyColor: 0x070709,
    metalness: 0.88,
    roughness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    rimLightIntensity: 2.2,
    linkedService: 'polimento',
  },
  {
    id: 'protecao',
    label: 'Escudo de Proteção',
    subtitle: 'Reflexo vitrificado com alta profundidade',
    bodyColor: 0x101116,
    metalness: 0.92,
    roughness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    rimLightIntensity: 2.5,
    linkedService: 'protecao',
  },
  {
    id: 'dourado',
    label: 'Ouro M Garage',
    subtitle: 'Acabamento exclusivo em ouro metálico',
    bodyColor: 0xc59b27,
    metalness: 0.94,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    rimLightIntensity: 2.0,
    linkedService: 'higienizacao',
  },
] as const;

export interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export const CAMERA_PRESETS: readonly CameraPreset[] = [
  {
    id: 'threeQuarter',
    label: '3/4 Frontal',
    position: [4.6, 1.95, 5.1],
    target: [0, 0.48, 0],
  },
  {
    id: 'profile',
    label: 'Perfil',
    position: [6.0, 1.45, 0.1],
    target: [0, 0.48, 0],
  },
  {
    id: 'rear',
    label: 'Traseira',
    position: [-4.5, 1.85, -4.9],
    target: [0, 0.48, 0],
  },
] as const;
