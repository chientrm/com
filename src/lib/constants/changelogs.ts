interface ChangeLog {
  createdAt: Date;
  changes: string[];
}

export const changeLogs: ChangeLog[] = [
  {
    createdAt: new Date('Thu Jul  6 05:08:18 PM UTC 2023'),
    changes: ['merge inbox and account page']
  },
  {
    createdAt: new Date('Thu Jul  6 08:20:51 AM UTC 2023'),
    changes: [
      'inbox',
      'remove sus 1. head',
      'ctrl + enter or alt + enter to submit form'
    ]
  }
];