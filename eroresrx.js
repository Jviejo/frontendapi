const { from, timer, interval, race, throwError, of } = require('rxjs');
const { tap, map, pipe, retry, switchMap, mapTo, catchError } = require('rxjs/operators');
const axios = require("axios");
var tasklist = require('tasklist');
var path = require('path')
myBatFilePath = path.join(__dirname, 'lanzar.bat');

const spawn = require('child_process').spawn;
const bat = spawn('cmd.exe', ['/c', myBatFilePath]);

// Handle normal output
bat.stdout.on('data', (data) => {
    // As said before, convert the Uint8Array to a readable string.
    
    console.info(data.toString());
});

// Handle error output
bat.stderr.on('data', (data) => {
    // As said before, convert the Uint8Array to a readable string.
    console.error(data.toString());
});



var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jviejo.gtt@gmail.com',
    pass: 'damehueco2012'
  }
});

var mailOptions = {
  from: 'jviejo.gtt@gmail.com',
  to: 'jviejo.gtt@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


from(tasklist()).subscribe(i => {
    var a = i.filter(j => j.imageName === 'node.exe')
    a.forEach(i1 => { console.log(i1.pid) })
    })
interval(1000).pipe(switchMap(i => {
    return race(
        from(axios.get('https://ovt.tributoslocales.es/ping')).pipe(mapTo('ok')),
        timer(1000).pipe(map((i => {
            throw 'error ... '
        })))).pipe(retry(3),
            catchError(i => {
                return of(i)
            })
        )
}
)).subscribe(i => {
    console.log(i)
}, (err) => {
    console.log(err)
})
