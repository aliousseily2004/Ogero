  export const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", age: 28, role: 'Admin' },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", age: 32, role: 'Editor' },
    { id: 3, name: "Michael Johnson", email: "michael.j@example.com", age: 24, role: 'Viewer' },
    { id: 4, name: "Emily Davis", email: "emily.d@example.com", age: 29, role: 'Moderator' },
    { id: 5, name: "Robert Wilson", email: "robert.w@example.com", age: 35, role: 'Analyst' },
    { id: 6, name: "Sarah Brown", email: "sarah.b@example.com", age: 27, role: 'Support' },
    { id: 7, name: "David Taylor", email: "david.t@example.com", age: 31, role: 'Developer' },
    { id: 8, name: "Jennifer Martinez", email: "jennifer.m@example.com", age: 26, role: 'HR' },
    { id: 9, name: "Thomas Anderson", email: "thomas.a@example.com", age: 33, role: 'Finance' },
    { id: 10, name: "Lisa Jackson", email: "lisa.j@example.com", age: 30, role: 'Guest' },
    { id: 11, name: "Daniel White", email: "daniel.w@example.com", age: 25, role: 'Editor' },
    { id: 12, name: "Olivia Harris", email: "olivia.h@example.com", age: 29, role: 'Viewer' },
    { id: 13, name: "James Martin", email: "james.m@example.com", age: 34, role: 'Admin' },
    { id: 14, name: "Sophia Garcia", email: "sophia.g@example.com", age: 27, role: 'Analyst' },
    { id: 15, name: "William Rodriguez", email: "william.r@example.com", age: 30, role: 'Support' }
  ];
  export const permissions = [
    { id: 1, role: 'Admin', description: 'Full access to all features', users: 2 },
    { id: 2, role: 'Editor', description: 'Can edit content, but not change settings', users: 2 },
    { id: 3, role: 'Viewer', description: 'Can view content only', users: 2 },
    { id: 4, role: 'Moderator', description: 'Can moderate user content', users: 1 },
    { id: 5, role: 'Analyst', description: 'Can view reports and analytics', users: 2 },
    { id: 6, role: 'Support', description: 'Can respond to support tickets', users: 2 },
    { id: 7, role: 'Developer', description: 'Can access developer tools and APIs', users: 1 },
    { id: 8, role: 'HR', description: 'Manage employee data and documents', users: 1 },
    { id: 9, role: 'Finance', description: 'Handle billing and invoices', users: 1 },
    { id: 10, role: 'Guest', description: 'Temporary access with limited permissions', users: 1 }
  ];
