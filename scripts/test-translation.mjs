import { translate } from '@vitalets/google-translate-api';
async function test() {
  try {
    const res = await translate('Gürültü ve Titreşim Maruziyet Risk Maliyet Hesaplayıcı', { to: 'en' });
    console.log("Success:", res.text);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
