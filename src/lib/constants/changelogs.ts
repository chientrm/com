interface ChangeLog {
  createdAt: Date;
  changes: string[];
}

export const changeLogs: ChangeLog[] = [
  {
    createdAt: new Date('Fri Aug  4 02:00:55 PM UTC 2023'),
    changes: ['rocketmouse', 'add singularity discord']
  },
  {
    createdAt: new Date('Sat Jul 22 06:06:35 PM UTC 2023'),
    changes: ['add countries globe']
  },
  {
    createdAt: new Date('Tue Jul 18 12:10:38 PM UTC 2023'),
    changes: ['are you not entertained?']
  },
  {
    createdAt: new Date('Fri Jul 14 09:15:03 AM UTC 2023'),
    changes: ['multiline ask', 'remove refresh button', 'total asks count']
  },
  {
    createdAt: new Date('Fri Jul  7 03:54:28 AM UTC 2023'),
    changes: ['counter']
  },
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
