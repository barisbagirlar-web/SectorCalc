/**
 * PM2 Ecosystem — SectorCalc Static Dev Server
 * 
 * 7/24 uptime garantisi:
 * - Build + serve process
 * - Otomatik restart (crash durumunda)
 * - PC restart → PM2 otomatik başlatır (pm2 startup)
 * 
 * KOMUTLAR:
 *   pm2 start ecosystem.config.cjs    # Başlat
 *   pm2 status                         # Durum
 *   pm2 logs                           # Log
 *   pm2 restart sectorcalc-dev         # Restart
 *   pm2 stop sectorcalc-dev            # Durdur
 *   pm2 delete sectorcalc-dev          # Sil
 *   pm2 startup                        # PC restart koruması
 *   pm2 save                           # Config kaydet
 */

module.exports = {
  apps: [
    {
      name: "sectorcalc-dev",
      script: "scripts/dev-static.mjs",
      cwd: __dirname,
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      watch: false, // dev-static.mjs kendi fs.watch'ini kullanır
      max_restarts: 999,
      restart_delay: 2000,
      min_uptime: 5000,
      max_memory_restart: "1G",
      error_file: ".pm2/err.log",
      out_file: ".pm2/out.log",
      pid_file: ".pm2/pid",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
