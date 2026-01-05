import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check if columns already exist
  const existingColumns = await prisma.column.count()
  
  if (existingColumns > 0) {
    console.log('✅ Database already seeded. Skipping seed.')
    return
  }

  console.log('🌱 Seeding database...')

  // Create columns in order
  const columnsData = [
    {
      name: 'Item',
      type: 'text',
      orderIndex: 0,
      settingsJson: null,
    },
    {
      name: 'Owner',
      type: 'select',
      orderIndex: 1,
      settingsJson: JSON.stringify({
        options: [
          { label: 'David', color: 'teal' },
          { label: 'Daniel', color: 'purple' },
        ],
      }),
    },
    {
      name: 'Status',
      type: 'select',
      orderIndex: 2,
      settingsJson: JSON.stringify({
        options: [
          { label: 'Backlog', color: 'gray' },
          { label: 'In Progress', color: 'yellow' },
          { label: 'Blocked', color: 'red' },
          { label: 'Done', color: 'green' },
        ],
      }),
    },
    {
      name: 'Priority',
      type: 'select',
      orderIndex: 3,
      settingsJson: JSON.stringify({
        options: [
          { label: 'Low', color: 'gray' },
          { label: 'Medium', color: 'blue' },
          { label: 'High', color: 'orange' },
          { label: 'Urgent', color: 'red' },
        ],
      }),
    },
    {
      name: 'Due Date',
      type: 'date',
      orderIndex: 4,
      settingsJson: null,
    },
    {
      name: 'Next Step',
      type: 'text',
      orderIndex: 5,
      settingsJson: null,
    },
    {
      name: 'Notes',
      type: 'text',
      orderIndex: 6,
      settingsJson: null,
    },
    {
      name: 'Tags',
      type: 'multi_select',
      orderIndex: 7,
      settingsJson: JSON.stringify({
        options: [
          { label: 'Ops', color: 'blue' },
          { label: 'Tech', color: 'purple' },
          { label: 'Finance', color: 'green' },
          { label: 'Compliance', color: 'red' },
          { label: 'Personal', color: 'pink' },
        ],
      }),
    },
    {
      name: 'Link',
      type: 'url',
      orderIndex: 8,
      settingsJson: null,
    },
    {
      name: 'Done?',
      type: 'checkbox',
      orderIndex: 9,
      settingsJson: null,
    },
  ]

  const columns = await Promise.all(
    columnsData.map((col) => prisma.column.create({ data: col }))
  )

  console.log(`✅ Created ${columns.length} columns`)

  // Create rows with cells
  const today = new Date()
  const sevenDaysLater = new Date(today)
  sevenDaysLater.setDate(today.getDate() + 7)

  // Row 1
  const row1 = await prisma.row.create({
    data: {
      orderIndex: 0,
      cells: {
        create: [
          {
            columnId: columns[0].id, // Item
            valueJson: JSON.stringify('Set up shared tracker'),
          },
          {
            columnId: columns[1].id, // Owner
            valueJson: JSON.stringify('Daniel'),
          },
          {
            columnId: columns[2].id, // Status
            valueJson: JSON.stringify('Done'),
          },
          {
            columnId: columns[3].id, // Priority
            valueJson: JSON.stringify('Medium'),
          },
          {
            columnId: columns[5].id, // Next Step
            valueJson: JSON.stringify('Add your real tasks'),
          },
          {
            columnId: columns[7].id, // Tags
            valueJson: JSON.stringify(['Tech']),
          },
          {
            columnId: columns[9].id, // Done?
            valueJson: JSON.stringify(true),
          },
        ],
      },
    },
  })

  // Row 2
  const row2 = await prisma.row.create({
    data: {
      orderIndex: 1,
      cells: {
        create: [
          {
            columnId: columns[0].id, // Item
            valueJson: JSON.stringify('Add first real project list'),
          },
          {
            columnId: columns[1].id, // Owner
            valueJson: JSON.stringify('David'),
          },
          {
            columnId: columns[2].id, // Status
            valueJson: JSON.stringify('In Progress'),
          },
          {
            columnId: columns[3].id, // Priority
            valueJson: JSON.stringify('High'),
          },
          {
            columnId: columns[4].id, // Due Date
            valueJson: JSON.stringify(sevenDaysLater.toISOString().split('T')[0]),
          },
          {
            columnId: columns[7].id, // Tags
            valueJson: JSON.stringify(['Ops']),
          },
        ],
      },
    },
  })

  // Row 3
  const row3 = await prisma.row.create({
    data: {
      orderIndex: 2,
      cells: {
        create: [
          {
            columnId: columns[0].id, // Item
            valueJson: JSON.stringify('Agree on weekly review cadence'),
          },
          {
            columnId: columns[1].id, // Owner
            valueJson: JSON.stringify('David'),
          },
          {
            columnId: columns[2].id, // Status
            valueJson: JSON.stringify('Backlog'),
          },
          {
            columnId: columns[3].id, // Priority
            valueJson: JSON.stringify('Medium'),
          },
          {
            columnId: columns[7].id, // Tags
            valueJson: JSON.stringify(['Personal']),
          },
        ],
      },
    },
  })

  console.log(`✅ Created 3 starter rows`)
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

