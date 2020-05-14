import { GPU } from 'gpu.js';


class App {
  constructor() {
    this.setup();
  }

  display() {
    this.canvas.style.position = "absolute";
    this.canvas.style.display = "block";

    const root = document.getElementById('root');
    root.parentElement.replaceChild(this.canvas, root);

    document.body.style.margin = 0;
  }

  setup() {
    const gpu = new GPU({mode: 'cpu'});

    const randomColor = () => [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];

    const mandel = gpu.createKernel(function(n, w, h, start, end) {
      const step = 4 / Math.min(w, h);

      const pointX = (-(w/2) + this.thread.x)*step;
      const pointY = (-(h/2) + this.thread.y)*step;

      if ((pointX**2 + pointY**2) > 4) {
        this.color(start[0]/255, start[1]/255, start[2]/255);

      } else {
        let za = 0,
            zb = 0,
            step = 0,
            oldza = 0;

        while (((za**2 + zb**2) <= 4) && (step < n)) {
          oldza = za;
          za = (za**2 - zb**2) + pointX;
          zb = (2*oldza*zb) + pointY;

          step += 1;
        }

        if(step == n) {
          this.color(0,0,0);
        } else {
          const dr = Math.floor((end[0] - start[0])*step/n);
          const dg = Math.floor((end[1] - start[1])*step/n);
          const db = Math.floor((end[2] - start[2])*step/n);

          this.color((start[0] + dr)/255, (start[1] + dg)/255, (start[2] + db)/255);
        }
      }
    }, {
      output: [innerWidth, innerHeight],
      graphical: true,
    })

    const start = randomColor();
    const end = randomColor();

    mandel(80, innerWidth, innerHeight, start, [0,255,0]);
    this.canvas = mandel.canvas;


  }
}

export default App;
