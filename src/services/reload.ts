import { db, doc, setDoc } from '@/firebase/firebase'

export default {
  async reloadCategoryData() {
    console.info('Reloading category data')

    await setDoc(doc(db, 'categories', '5e861fdaa52672a5d4727ba2'), {
      id: '5e861fdaa52672a5d4727ba2',
      name: 'Entertainment',
      subcategories: [
        {
          id: '278e848f-a17b-40c0-998a-a378265e8af1',
          name: 'Amazon Prime',
          matchText: ['Prime Video'],
        },
        {
          id: 'b0b569d4-5e45-4a46-8532-4037799e2984',
          name: 'NetFlix',
          matchText: ['Netflix'],
        },
      ],
    })

    await setDoc(doc(db, 'categories', '5e861fdaa52672a5d4727ba5'), {
      id: '5e861fdaa52672a5d4727ba5',
      name: 'Auto',
      subcategories: [
        { id: '88', name: 'Auto Insurance', matchText: ['Progressive'] },
        { id: '11', name: 'Auto Service', matchText: ['Ford', 'Subaru'] },
        { id: '5', name: 'Gas', matchText: ['ExxonMobil', 'Valero'] },
        {
          id: '5de64c34-2c65-49b6-9e2e-851d636c623c',
          name: 'Tolls',
          matchText: ['NC Quick Pass'],
        },
      ],
    })

    await setDoc(doc(db, 'categories', '5e861fdaa52672a5d4727ba6'), {
      id: '5e861fdaa52672a5d4727ba6',
      name: 'Groceries',
      subcategories: [
        {
          id: 'b2bb1c1b-31fb-473a-a12c-f6d41ad43e3d',
          name: 'Costco',
          matchText: ['Costco'],
        },
        { id: '7', name: 'Food Lion', matchText: ['Food Lion'] },
        {
          id: '2',
          name: 'Harris Teeter',
          matchText: ['Harris Teeter', 'HarrisTeeter'],
        },
        {
          id: '2fe9b764-cb3b-45fb-8b42-064c5150595a',
          name: "Trader Joe's",
          matchText: ["Trader Joe's"],
        },
        {
          id: '36cdfa12-b86c-4c63-9be6-2a030629df1f',
          name: 'Whole Foods',
          matchText: ['WHOLEFDS'],
        },
      ],
    })

    await setDoc(doc(db, 'categories', '5e95f54bb208626f3d10bd5f'), {
      id: '5e95f54bb208626f3d10bd5f',
      name: 'Lawn & Garden',
      subcategories: [
        {
          id: '1941659a-f18e-4799-bf3f-7c6670e579ba',
          name: 'Lawn',
          matchText: ['Lawn Doctor'],
        },
        {
          id: 'dac57ae9-97b9-4ef3-92b5-b43804fc7c0e',
          name: 'Plants/Mulch',
          matchText: [
            'Big Bloomers',
            'For Gardens Sake',
            'Garden Supply',
            'GrowingWild',
            'Kiefer Landscaping',
            'Lowes',
          ],
        },
      ],
    })

    await setDoc(doc(db, 'categories', '5e98904f990b7282f49e824d'), {
      id: '5e98904f990b7282f49e824d',
      name: 'Utilities',
      subcategories: [
        { id: '4325bc4d-83e3-4a61-9564-c44b3208afd1', name: 'Electric' },
        {
          id: '0339124a-75c1-4cdf-8002-1d7edd532a64',
          name: 'Gas',
          matchText: ['Valero'],
        },
        {
          id: 'cc132225-48cf-4873-9058-d6e6bd506949',
          name: 'Internet',
          matchText: ['Spectrum'],
        },
        {
          id: 'f036a7fd-46b9-4b56-8210-6c44665856a8',
          name: 'Phone',
          matchText: ['VZWRLSS'],
        },
      ],
    })

    await setDoc(doc(db, 'categories', '5ed1562ceca66f3f22527528'), {
      id: '5ed1562ceca66f3f22527528',
      name: 'Travel',
      subcategories: [
        { id: 'travel-s1', name: 'Holiday Inn Express', matchText: [] },
        { id: 'travel-s2', name: 'Marriott Hotel', matchText: [] },
        { id: 'travel-s3', name: 'Southwest Airlines', matchText: [] },
      ],
    })
  },

  async reloadExpenseData() {
    console.info('Reloading expense data')

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7a9'), {
      id: '5ed1b13cff0588531fa7b7a9',
      trxDate: '2022-03-22',
      description: 'Prime Video*2N13N8ED3 888-802-3080 WA',
      amount: 6.39,
      categoryId: '5e861fdaa52672a5d4727ba2',
      subcategoryId: '278e848f-a17b-40c0-998a-a378265e8af1',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 3,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7ac'), {
      id: '5ed1b13cff0588531fa7b7ac',
      trxDate: '2022-03-17',
      description: 'SPECTRUM 855-707-7328 NC',
      amount: 69.99,
      categoryId: '5e98904f990b7282f49e824d',
      subcategoryId: 'cc132225-48cf-4873-9058-d6e6bd506949',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 3,
    })
    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7b0'), {
      id: '5ed1b13cff0588531fa7b7b0',
      trxDate: '2022-03-14',
      description: 'NC QUICK PASS 800-950-1292 NC',
      amount: 65,
      categoryId: '5e861fdaa52672a5d4727ba5',
      subcategoryId: '5de64c34-2c65-49b6-9e2e-851d636c623c',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 3,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7b3'), {
      id: '5ed1b13cff0588531fa7b7b3',
      trxDate: '2022-03-10',
      description: 'RGP*Lawn Doctor 859 919-3621808 NC',
      amount: 70,
      categoryId: '5e95f54bb208626f3d10bd5f',
      subcategoryId: '1941659a-f18e-4799-bf3f-7c6670e579ba',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 3,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7b6'), {
      id: '5ed1b13cff0588531fa7b7b6',
      trxDate: '2022-03-09',
      description: 'Netflix.com 408-5403700 CA',
      amount: 13.87,
      categoryId: '5e861fdaa52672a5d4727ba2',
      subcategoryId: 'b0b569d4-5e45-4a46-8532-4037799e2984',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 3,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7bb'), {
      id: '5ed1b13cff0588531fa7b7bb',
      trxDate: '2022-02-27',
      description: 'FOR GARDENS SAKE NURSERY DURHAM NC',
      amount: 46.91,
      categoryId: '5e95f54bb208626f3d10bd5f',
      subcategoryId: 'dac57ae9-97b9-4ef3-92b5-b43804fc7c0e',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 2,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7c9'), {
      id: '5ed1b13cff0588531fa7b7c9',
      trxDate: '2022-02-18',
      description: 'PITTSBORO VALERO PITTSBORO NC',
      amount: 11.84,
      categoryId: '5e98904f990b7282f49e824d',
      subcategoryId: '0339124a-75c1-4cdf-8002-1d7edd532a64',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 2,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7d2'), {
      id: '5ed1b13cff0588531fa7b7d2',
      trxDate: '2022-02-11',
      description: 'HARRISTEETER #236 CARY NC',
      amount: 11.91,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '2',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 2,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7d3'), {
      id: '5ed1b13cff0588531fa7b7d3',
      trxDate: '2022-02-10',
      description: 'SPECTRUM 855-707-7328 NC',
      amount: 69.99,
      categoryId: '5e98904f990b7282f49e824d',
      subcategoryId: 'cc132225-48cf-4873-9058-d6e6bd506949',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 2,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7d7'), {
      id: '5ed1b13cff0588531fa7b7d7',
      trxDate: '2022-02-09',
      description: 'Netflix.com 408-5403700 CA',
      amount: 13.87,
      categoryId: '5e861fdaa52672a5d4727ba2',
      subcategoryId: 'b0b569d4-5e45-4a46-8532-4037799e2984',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 2,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7db'), {
      id: '5ed1b13cff0588531fa7b7db',
      trxDate: '2022-02-07',
      description: 'FOOD LION #0884 PITTSBORO NC',
      amount: 62.93,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '7',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 2,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7dc'), {
      id: '5ed1b13cff0588531fa7b7dc',
      trxDate: '2022-02-07',
      description: 'EXXONMOBIL 47312202 APEX NC',
      amount: 16.89,
      categoryId: '5e861fdaa52672a5d4727ba5',
      subcategoryId: '5',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 2,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7e0'), {
      id: '5ed1b13cff0588531fa7b7e0',
      trxDate: '2022-02-05',
      description: 'HARRIS TEETER #0058 APEX NC',
      amount: 23.54,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '2',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 2,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7e9'), {
      id: '5ed1b13cff0588531fa7b7e9',
      trxDate: '2022-02-01',
      description: 'EXXONMOBIL 47312202 APEX NC',
      amount: 21.91,
      categoryId: '5e861fdaa52672a5d4727ba5',
      subcategoryId: '5',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 2,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7ea'), {
      id: '5ed1b13cff0588531fa7b7ea',
      trxDate: '2022-01-31',
      description: 'LOWES #01878* APEX NC',
      amount: 32.07,
      categoryId: '5e95f54bb208626f3d10bd5f',
      subcategoryId: 'dac57ae9-97b9-4ef3-92b5-b43804fc7c0e',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7ed'), {
      id: '5ed1b13cff0588531fa7b7ed',
      trxDate: '2022-01-31',
      description: 'COSTCO WHSE #1206 APEX NC',
      amount: 33.62,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: 'b2bb1c1b-31fb-473a-a12c-f6d41ad43e3d',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7f6'), {
      id: '5ed1b13cff0588531fa7b7f6',
      trxDate: '2022-01-29',
      description: 'FOOD LION #0884 PITTSBORO NC',
      amount: 22.26,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '7',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7f7'), {
      id: '5ed1b13cff0588531fa7b7f7',
      trxDate: '2022-01-28',
      description: 'LOWES #01878* APEX NC',
      amount: 54.95,
      categoryId: '5e95f54bb208626f3d10bd5f',
      subcategoryId: 'dac57ae9-97b9-4ef3-92b5-b43804fc7c0e',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7fd'), {
      id: '5ed1b13cff0588531fa7b7fd',
      trxDate: '2022-01-25',
      description: 'EXXONMOBIL 47312202 APEX NC',
      amount: 19.35,
      categoryId: '5e861fdaa52672a5d4727ba5',
      subcategoryId: '5',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b7fe'), {
      id: '5ed1b13cff0588531fa7b7fe',
      trxDate: '2022-01-25',
      description: 'NC QUICK PASS 800-950-1292 NC',
      amount: 85,
      categoryId: '5e861fdaa52672a5d4727ba5',
      subcategoryId: '5de64c34-2c65-49b6-9e2e-851d636c623c',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b803'), {
      id: '5ed1b13cff0588531fa7b803',
      trxDate: '2022-01-22',
      description: 'RGP*Lawn Doctor 859 Apex NC',
      amount: 70,
      categoryId: '5e95f54bb208626f3d10bd5f',
      subcategoryId: '1941659a-f18e-4799-bf3f-7c6670e579ba',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b811'), {
      id: '5ed1b13cff0588531fa7b811',
      trxDate: '2022-01-20',
      description: 'BP#8276610CIRCLE K ST 27 APEX NC',
      amount: 24.87,
      categoryId: '5e861fdaa52672a5d4727ba5',
      subcategoryId: '5',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b815'), {
      id: '5ed1b13cff0588531fa7b815',
      trxDate: '2022-01-17',
      description: 'Prime Video*RH6SK2PF3 888-802-3080 WA',
      amount: 6.39,
      categoryId: '5e861fdaa52672a5d4727ba2',
      subcategoryId: '278e848f-a17b-40c0-998a-a378265e8af1',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b817'), {
      id: '5ed1b13cff0588531fa7b817',
      trxDate: '2022-01-17',
      description: 'HARRIS TEETER #0137 CHAPEL HILL NC',
      amount: 62.02,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '2',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b81c'), {
      id: '5ed1b13cff0588531fa7b81c',
      trxDate: '2022-01-15',
      description: "TRADER JOE'S #741 QPS CARY NC",
      amount: 57.06,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '2fe9b764-cb3b-45fb-8b42-064c5150595a',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b820'), {
      id: '5ed1b13cff0588531fa7b820',
      trxDate: '2022-01-14',
      description: 'EXXONMOBIL 96822796 APEX NC',
      amount: 25.03,
      categoryId: '5e861fdaa52672a5d4727ba5',
      subcategoryId: '5',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b825'), {
      id: '5ed1b13cff0588531fa7b825',
      trxDate: '2022-01-12',
      description: 'FOOD LION #0884 PITTSBORO NC',
      amount: 9.77,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '7',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b82c'), {
      id: '5ed1b13cff0588531fa7b82c',
      trxDate: '2022-01-10',
      description: 'COSTCO WHSE #1206 APEX NC',
      amount: 33.55,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: 'b2bb1c1b-31fb-473a-a12c-f6d41ad43e3d',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b82f'), {
      id: '5ed1b13cff0588531fa7b82f',
      trxDate: '2022-01-09',
      description: 'SPECTRUM 855-707-7328 NC',
      amount: 69.99,
      categoryId: '5e98904f990b7282f49e824d',
      subcategoryId: 'cc132225-48cf-4873-9058-d6e6bd506949',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b831'), {
      id: '5ed1b13cff0588531fa7b831',
      trxDate: '2022-01-09',
      description: 'Netflix.com 408-5403700 CA',
      amount: 13.87,
      categoryId: '5e861fdaa52672a5d4727ba2',
      subcategoryId: 'b0b569d4-5e45-4a46-8532-4037799e2984',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b832'), {
      id: '5ed1b13cff0588531fa7b832',
      trxDate: '2022-01-09',
      description: 'LOWES #01878* APEX NC',
      amount: 18.66,
      categoryId: '5e95f54bb208626f3d10bd5f',
      subcategoryId: 'dac57ae9-97b9-4ef3-92b5-b43804fc7c0e',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b834'), {
      id: '5ed1b13cff0588531fa7b834',
      trxDate: '2022-01-09',
      description: 'HARRIS TEETER #0058 APEX NC',
      amount: 46.69,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '2',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b835'), {
      id: '5ed1b13cff0588531fa7b835',
      trxDate: '2022-01-09',
      description: '4TE*CHATHAM CO NC UTILITY866-290-5400 NC',
      amount: 3.95,
      categoryId: '5e98904f990b7282f49e824d',
      subcategoryId: '3aac9bef-21b6-4c8c-bdea-5d4e77414ffe',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b836'), {
      id: '5ed1b13cff0588531fa7b836',
      trxDate: '2022-01-09',
      description: '4TE*CHATHAM CO UTL WEB NC866-764-2002 NC',
      amount: 29,
      categoryId: '5e98904f990b7282f49e824d',
      subcategoryId: '3aac9bef-21b6-4c8c-bdea-5d4e77414ffe',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b839'), {
      id: '5ed1b13cff0588531fa7b839',
      trxDate: '2022-01-07',
      description: 'WHOLEFDS CAR 10132 CARY NC',
      amount: 74.21,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '36cdfa12-b86c-4c63-9be6-2a030629df1f',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b83b'), {
      id: '5ed1b13cff0588531fa7b83b',
      trxDate: '2022-01-05',
      description: 'PROGRESSIVE *INSURANCE 800-776-4737 OH',
      amount: 300,
      categoryId: '5e861fdaa52672a5d4727ba5',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
      subcategoryId: '88',
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b841'), {
      id: '5ed1b13cff0588531fa7b841',
      trxDate: '2022-01-04',
      description: 'FOOD LION #0884 PITTSBORO NC',
      amount: 47.3,
      categoryId: '5e861fdaa52672a5d4727ba6',
      subcategoryId: '7',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b842'), {
      id: '5ed1b13cff0588531fa7b842',
      trxDate: '2022-01-03',
      description: 'Prime Video*MO38L5US3 888-802-3080 WA',
      amount: 4.26,
      categoryId: '5e861fdaa52672a5d4727ba2',
      subcategoryId: '278e848f-a17b-40c0-998a-a378265e8af1',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b843'), {
      id: '5ed1b13cff0588531fa7b843',
      trxDate: '2022-01-03',
      description: 'THE HOME DEPOT #3644 APEX NC',
      amount: 23.57,
      categoryId: '5e95f54bb208626f3d10bd5f',
      subcategoryId: 'dac57ae9-97b9-4ef3-92b5-b43804fc7c0e',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b844'), {
      id: '5ed1b13cff0588531fa7b844',
      trxDate: '2022-01-02',
      description: 'CROSSROADS FORD INC APEX NC',
      amount: 38.94,
      categoryId: '5e861fdaa52672a5d4727ba5',
      subcategoryId: '11',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    await setDoc(doc(db, 'expenses', '5ed1b13cff0588531fa7b846'), {
      id: '5ed1b13cff0588531fa7b846',
      trxDate: '2022-01-02',
      description: 'BP#8276610CIRCLE K ST 27 APEX NC',
      amount: 30.17,
      categoryId: '5e861fdaa52672a5d4727ba5',
      subcategoryId: '5',
      importId: '5ed1b13cff0588531fa7b7a4',
      trxYear: 2022,
      trxMonth: 1,
    })

    console.info('Done reloading expense data')
  },
}
