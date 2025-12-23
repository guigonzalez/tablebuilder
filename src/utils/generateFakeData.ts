import type { TableColumn, FakeRowData } from '../types';

const fakeNames = [
  'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis',
  'David Wilson', 'Jessica Taylor', 'Daniel Anderson', 'Ashley Thomas',
];

const fakeStatuses = [
  { label: 'Active', variant: 'success' },
  { label: 'Pending', variant: 'warning' },
  { label: 'Inactive', variant: 'error' },
  { label: 'Under Review', variant: 'info' },
];

const fakeTexts = [
  'Lorem ipsum dolor', 'Consectetur adipiscing', 'Sed do eiusmod',
  'Tempor incididunt', 'Ut labore et dolore', 'Magna aliqua',
];

// Dados fake para novos tipos de coluna
const fakeCampaigns = [
  { title: 'Seasonal Magic: Perfect Fit...', subtitle: 'Disney • Product Seeding' },
  { title: 'Stellar Summer Soiree: Crafting Unforgettable Win...', subtitle: 'Disney • Product Seeding' },
  { title: 'Holiday Specials Campaign', subtitle: 'Netflix • Sponsored Content' },
  { title: 'New Year Launch Event', subtitle: 'Amazon • Affiliate Marketing' },
  { title: 'Spring Collection Preview', subtitle: 'Nike • Brand Partnership' },
];

const fakeUsers = [
  { name: 'Name here', location: 'United States', verified: true },
  { name: 'Insense', location: 'insense.pro', verified: false },
  { name: 'Sarah Johnson', location: 'Canada', verified: true },
  { name: 'Mike Chen', location: 'Singapore', verified: true },
  { name: 'Emma Wilson', location: 'United Kingdom', verified: false },
];

const fakeBrands = [
  { name: 'Insense', url: 'insense.pro', isYou: true },
  { name: 'Jane Doe', url: 'insense.pro', isYou: true },
  { name: 'Acme Corp', url: 'acme.com', isYou: false },
  { name: 'TechStart', url: 'techstart.io', isYou: true },
  { name: 'GlobalBrand', url: 'globalbrand.com', isYou: false },
];

const fakeBrandIcons = [
  'Seasonal Magic: Perfect Fit...',
  'Summer Collection 2024',
  'Winter Essentials Guide',
  'Spring Fashion Week',
  'Autumn Trends Report',
];

const fakeTeamMembers = [
  { name: 'Jane Doe', initials: 'SY', badgeCount: 2 },
  { name: 'John Smith', initials: 'JS', badgeCount: 1 },
  { name: 'Maria Garcia', initials: 'MG', badgeCount: 0 },
  { name: 'Alex Kim', initials: 'AK', badgeCount: 2 },
  { name: 'Sam Wilson', initials: 'SW', badgeCount: 1 },
];

const fakeListItems = [
  'Seasonal Magic: Perfect Fit s...',
  'Q4 Marketing Strategy',
  'Product Launch Checklist',
  'Brand Guidelines 2024',
  'Campaign Analytics Report',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(): string {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString('en-US');
}

function randomCurrency(): string {
  const value = randomNumber(100, 10000) + randomNumber(0, 99) / 100;
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function generateFakeData(columns: TableColumn[], rowCount: number = 5): FakeRowData[] {
  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const row: FakeRowData = { _id: `row-${rowIndex}` };

    columns.forEach(col => {
      switch (col.columnType) {
        case 'text':
          row[col.id] = randomItem(fakeTexts);
          break;
        case 'number':
          row[col.id] = randomNumber(1, 1000);
          break;
        case 'currency':
          row[col.id] = randomCurrency();
          break;
        case 'status':
          row[col.id] = randomItem(fakeStatuses).label;
          row[`${col.id}_variant`] = randomItem(fakeStatuses).variant;
          break;
        case 'date':
          row[col.id] = randomDate();
          break;
        case 'avatar-text':
          row[col.id] = randomItem(fakeNames);
          break;
        case 'checkbox':
          row[col.id] = Math.random() > 0.5;
          break;
        case 'actions':
          row[col.id] = null;
          break;
        // Novos tipos de coluna
        case 'campaign-1line':
        case 'campaign-2lines': {
          const campaign = randomItem(fakeCampaigns);
          row[col.id] = campaign.title;
          row[`${col.id}_subtitle`] = campaign.subtitle;
          break;
        }
        case 'user-badge': {
          const user = randomItem(fakeUsers);
          row[col.id] = user.name;
          row[`${col.id}_location`] = user.location;
          row[`${col.id}_verified`] = user.verified;
          break;
        }
        case 'brand-badge': {
          const brand = randomItem(fakeBrands);
          row[col.id] = brand.name;
          row[`${col.id}_url`] = brand.url;
          row[`${col.id}_isYou`] = brand.isYou;
          break;
        }
        case 'brand-icon':
          row[col.id] = randomItem(fakeBrandIcons);
          break;
        case 'team-member': {
          const member = randomItem(fakeTeamMembers);
          row[col.id] = member.name;
          row[`${col.id}_initials`] = member.initials;
          row[`${col.id}_badgeCount`] = member.badgeCount;
          break;
        }
        case 'list-item':
          row[col.id] = randomItem(fakeListItems);
          break;
        default:
          row[col.id] = '';
      }
    });

    return row;
  });
}
