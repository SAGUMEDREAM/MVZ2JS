/*

****    ****
****Multitouch for Kaboom v3000****
****By nap.world****
****v1.0  ****
****    ****

*/

export default function MultitouchComponent() {
  return {
    multitouch() {

      let touches = []
      const gscale = canvas.width / width() / window.devicePixelRatio
      let point = false
      let points = []

      let touchEnd = function(obj, t) {
        if (points[t.identifier]) {
          obj.trigger("pointEnd", touches.length)
          points[t.identifier] = false
        }

        touches = touches.filter((elem) =>
          elem.identifier !== t.identifier)
      }

      return {

        id: "multitouch",
        require: ["area"],

        add() {
          onTouchStart((pos, t) => {
            if (this.hasPoint(pos.scale(1/gscale))) {
              touches.push(t)
              point = true
              this.trigger("point", touches.length)
              points[t.identifier] = true
            }
          })

          onTouchMove((pos, t) => {
            if (this.hasPoint(pos.scale(1/gscale))) {
              touches.splice(t.identifier, 1, t)
              if (points[t.identifier] !== true) {
                this.trigger("point", touches.length)
                points[t.identifier] = true
              }

            }
            else {
              touchEnd(this, t)
            }
          })

          onTouchEnd((pos, t) => {
            touchEnd(this, t)
          })
        },
        update() {
          if (touches.length > 0) {
            this.trigger("pointUpdate", touches.length)
          }
        },
        onPoint(f) {
          this.on("point", f)
        },
        onPointUpdate(f) {
          this.on("pointUpdate", f)
        },
        onPointEnd(f) {
          this.on("pointEnd", f)
        },
        isPointed(){
          if (point) {
            point = false
            return true
          }
          else return point
        },
        isTouching(){
          return touches.length > 0
        },
      }
    }
  }
}
