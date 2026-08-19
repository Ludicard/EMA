import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Por favor, proporciona el email del usuario. Ejemplo: npx ts-node src/seed.ts admin@empresa.com');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { company: true },
  });

  if (!user) {
    console.error(`Usuario con email ${email} no encontrado.`);
    process.exit(1);
  }

  if (!user.companyId) {
    console.error(`El usuario ${email} no pertenece a ninguna empresa. Por favor, crea o únete a una empresa primero en la aplicación.`);
    process.exit(1);
  }

  const companyId = user.companyId;
  console.log(`Creando datos de prueba para la empresa: ${user.company?.name}...`);

  // Crear 10 clientes falsos
  const clients: any[] = [];
  for (let i = 1; i <= 10; i++) {
    const client = await prisma.client.create({
      data: {
        companyId,
        name: `Cliente de Prueba ${i} S.A.`,
        email: `contacto${i}@cliente.com`,
        phone: `+34 600 000 00${i}`,
        identification: `B1234567${i}`,
      },
    });
    clients.push(client);
  }
  console.log('✅ 10 Clientes creados.');

  // Crear 40 facturas distribuidas en los últimos 6 meses
  const statuses = ['PAID', 'PAID', 'PAID', 'PENDING', 'PENDING', 'CANCELLED'];
  let createdInvoices = 0;

  const now = new Date();
  
  for (let i = 0; i < 40; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    
    // Random month between 0 and 5 months ago
    const monthsAgo = Math.floor(Math.random() * 6);
    const issueDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, Math.floor(Math.random() * 28) + 1);
    
    // Due date is 30 days after issue date
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);

    // Status logic
    let status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    
    // If pending and due date passed, it will be considered overdue by the dashboard automatically
    
    const amount = Math.floor(Math.random() * 5000) + 100; // Between 100 and 5100

    await prisma.invoice.create({
      data: {
        companyId,
        clientId: client.id,
        number: `INV-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        issueDate,
        dueDate,
        amount,
        status,
        notes: 'Factura generada automáticamente para pruebas.',
      },
    });
    createdInvoices++;
  }

  console.log(`✅ ${createdInvoices} Facturas creadas distribuidas en los últimos 6 meses.`);
  console.log('🎉 ¡Datos de prueba inyectados correctamente! Ve a tu Dashboard y actualiza la página.');
}

main()
  .catch((e) => {
    console.error('Error inyectando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
