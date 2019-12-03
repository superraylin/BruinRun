# Team Project Bruin Bruin

## What is your project and how do you use it?
Our project "Bruin Run" is similar to the game "Temple Run." We control a bruin on a skate board to roam around the UCLA campus to collect pumpkins as much as possible while avoiding all the skelecton obstacles. The controls are listed below:
  
  Command       - Key
* Start Game    - 4
* Restart Game  - r
* Right         - 1
* Left          - 3
* Jump          - 2
* Speed Up      - 9
* Slow Down     - 0
## Who did what?

### Ray Lin      705224483
  I developed the fundamental outline of the game, including path planning, camera tracking, random obstacle generation, collision detection, basic movement controls, and physic-based jump. On top of the game logic, I am also resposonsible for positions, models and textures of pumpkin, skull, bruin statue (texture only), and plating the ground with grass. 
  
  
  For optimization, I lowered the complexity of collision detection. Since we only need to detect the collision between the bruin and obstacles, we can shrink the size of bruin to a point and increase the radius of each obstacle by the same amount. Then, we only need to check if the distance between the bruin and each obstacle is less than the obstacle's radius.  

### Shuo Yang    405427873

### Yunpeng Ding 005430274

## Citation
[obj file of skull](https://www.turbosquid.com/FullPreview/Index.cfm/ID/1452999)

[obj file of pumpkin](https://www.turbosquid.com/FullPreview/Index.cfm/ID/776815)

[texture of grass](https://freerangestock.com/photos/121120/green-grass-texture-full-frame.html)

What topics in the course are used and how?

We would apply the topics taught till October into our projects, including transformation, eye space and perspective projection. In detail, we would use rotation to change the moving direction of the player, and use look-at function and perspective projection to change the direction and position of the view. We would use translation for moving, and use scaling when barriers approach the player.

What interactivity will you use?

We would like to design this team project as a small video game. We will implement game process control including start, pause, restart and end the game. In addition, we are going to finish motion control of the game including turn left, turn right, and jump. If time permits, we would also finish perspective control part.

Are there any advanced features that you’ll be implementing?

We will implement a physics-based simulation for our jump control as our advance feature. When “Bruin” meets obstacles, the player will control him to jump over the obstacles.
