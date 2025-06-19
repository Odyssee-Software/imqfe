const { ExecuteWorkflow } = require('../dist');

let flow = {
  tasks: {
    getDate: {
      provides: ['date'],
      resolver: {
        name: 'flowed::Echo',
        params: { in: { value: new Date() } },
        results: { out: 'date' },
      }
    },
    convertToObj: {
      requires: ['date'],
      provides: ['valueFromA'],
      resolver: {
        name: 'flowed::Echo',
        params: {
          in: {
            transform: {
              day: '{{date.getDate()}}',
              month: '{{date.getMonth() + 1}}',
              year: '{{date.getFullYear()}}',
            }
          }
        },
        results: { out: 'valueFromA' },
      }
    },
    print: {
      requires: [ 'valueFromA' ],
      provides: ['valueFromB'],
      resolver: {
        name: 'Print',
        // params: {
        //   payload : {
        //     transform: {
        //       properties : {
        //         message: '{{valueFromA}}'
        //       }
        //     }
        //   }
        // },
        results: { out: 'valueFromB' },
      }
    },
    print2: {
      requires: [ 'valueFromB' ],
      provides: ['valueFromC'],
      resolver: {
        name: 'Print',
        results: { out: 'valueFromC' },
      }
    },
  }
};

let flow2 = {
  tasks : {
    getDate: {
      provides: ['date'],
      resolver: { name: 'DateNow' },
    }
  },
}

ExecuteWorkflow( flow2 , [ 'date' ] )
.then(( result ) => {
  console.log({ flow , result })
})