import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SERVICES,
  WHATSAPP_BASE_URL,
  WHATSAPP_DISPLAY,
  FINISH_PRESETS,
  CAMERA_PRESETS,
  buildWhatsAppUrl,
} from './mgarage';

test('SERVICES contains exclusively the four required services with exact copy', () => {
  assert.equal(SERVICES.length, 4);

  assert.deepEqual(
    SERVICES.map((s) => ({ title: s.title, description: s.description })),
    [
      { title: 'Lavagem', description: 'Completa por fora e por dentro.' },
      { title: 'Higienização', description: 'Interna completa.' },
      { title: 'Polimento', description: 'Brilho intenso e remoção de imperfeições.' },
      {
        title: 'Proteção',
        description: 'Produtos de alta qualidade que protegem e valorizam seus veículos.',
      },
    ]
  );
});

test('WhatsApp constants and contextual URL builder work correctly', () => {
  assert.equal(WHATSAPP_DISPLAY, '(15) 99122-3984');
  assert.equal(WHATSAPP_BASE_URL, 'https://wa.me/5515991223984');

  const generalUrl = buildWhatsAppUrl();
  assert.ok(generalUrl.startsWith('https://wa.me/5515991223984?text='));

  for (const service of SERVICES) {
    const url = buildWhatsAppUrl(service.id);
    assert.ok(url.startsWith('https://wa.me/5515991223984?text='));
    const decoded = decodeURIComponent(url.split('?text=')[1]);
    assert.ok(
      decoded.includes(service.title),
      `Expected WhatsApp message for ${service.id} to mention ${service.title}`
    );
  }
});

test('3D studio presets are properly calibrated', () => {
  assert.equal(FINISH_PRESETS.length, 4);
  assert.equal(CAMERA_PRESETS.length, 3);
  for (const preset of FINISH_PRESETS) {
    assert.ok(preset.metalness >= 0 && preset.metalness <= 1);
    assert.ok(preset.roughness >= 0 && preset.roughness <= 1);
    assert.ok(preset.clearcoat >= 0 && preset.clearcoat <= 1);
  }
});
