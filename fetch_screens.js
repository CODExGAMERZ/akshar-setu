const fs = require('fs');
const https = require('https');
const path = require('path');

const screens = [
  { id: 'welcome', title: 'Welcome to AksharSetu', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OWU4NzJjMTdhNWEwNGVhYjQyY2FiMDdhOTE4EgsSBxD59I3vrg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTA2MzE2ODkwNDExNzMzNTY3MQ&filename=&opi=89354086' },
  { id: 'calibration', title: 'Personalize Your View', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OWU4NzJhZDc2MWMwMmQzZDE1N2U4MDQ2YzNhEgsSBxD59I3vrg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTA2MzE2ODkwNDExNzMzNTY3MQ&filename=&opi=89354086' },
  { id: 'profile_ready', title: 'Profile Ready', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OWU4NzJjOTY4YjgwMjJkNmI4Yzk2MWQ5NWQyEgsSBxD59I3vrg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTA2MzE2ODkwNDExNzMzNTY3MQ&filename=&opi=89354086' },
  { id: 'upload_text', title: 'Add Reading Material', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OWU4NzQzMGZhMzMwMWI0ZTY5MDY1MWRhMTU3EgsSBxD59I3vrg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTA2MzE2ODkwNDExNzMzNTY3MQ&filename=&opi=89354086' },
  { id: 'history', title: 'Your Reading History', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OWU4NzM2NmJjNGYwNzA5MzE3MTQzMDg1OWZjEgsSBxD59I3vrg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTA2MzE2ODkwNDExNzMzNTY3MQ&filename=&opi=89354086' },
  { id: 'reading_view', title: 'Reading Assistant', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OWU4NzNiNmUyYTMwMzgzOTFiYzA2MDRjOTkxEgsSBxD59I3vrg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTA2MzE2ODkwNDExNzMzNTY3MQ&filename=&opi=89354086' },
  { id: 'settings', title: 'Settings and Personalization', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OWU4NzQxNGM3MmIwMWI0ZTRiZmNlMGEyODNlEgsSBxD59I3vrg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTA2MzE2ODkwNDExNzMzNTY3MQ&filename=&opi=89354086' },
  { id: 'language_switcher', title: 'Switch Language', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OWU4NzMzNThhZTMwMzZjN2ZkNzJhMDI5NWZiEgsSBxD59I3vrg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTA2MzE2ODkwNDExNzMzNTY3MQ&filename=&opi=89354086' },
  { id: 'reading_app_full', title: 'AksharSetu Reading App', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OWU4N2JkMGYyNTkwMmE5YjM2YzExMDM0OWMwEgsSBxD59I3vrg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTA2MzE2ODkwNDExNzMzNTY3MQ&filename=&opi=89354086' }
];

const outDir = path.join(__dirname, 'stitch_raw_html');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const s of screens) {
    console.log(`Downloading ${s.title}...`);
    const file = path.join(outDir, `${s.id}.html`);
    await download(s.url, file);
    console.log(`Saved ${s.id}.html (${fs.statSync(file).size} bytes)`);
  }
  console.log('All downloads completed!');
}

run();
