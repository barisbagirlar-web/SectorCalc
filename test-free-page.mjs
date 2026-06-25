import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3006/tr/tools/free/fleet-fuel-distance-cost');
    console.log("Status:", res.status);
    const text = await res.text();
    if (!res.ok) {
      console.error("Error Text:", text.slice(0, 500));
    } else {
      console.log("Success! Page length:", text.length);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

test();
