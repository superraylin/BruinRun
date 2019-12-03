# Team Project Bruin Bruin

## What is your project and how do you use it?
Our project "Bruin Run" is similar to the game "Temple Run." We control a bruin on a skate board to roam around the UCLA campus to collect pumpkins as much as possible while avoiding all the skelecton obstacles. The skeleton and pumpkin are there to create a Halloween theme. 

Please wait 10 ~ 30 seconds for the game to be completely loaded. Press '4' to start the game; use buttons '1', '2', and '3' to control movements. The game ends when the bruin collides with an obstacle. Press 'r' to restart the game. you can also speed up or slow down the bruin to increase/decrease the difficulty. 

The controls are listed below:
  
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
  I developed the fundamental outline of the game, including path planning, camera tracking, random obstacle generation, **collision detection**, basic movement controls, and **physic-based jump**. On top of the game logic, I am also resposonsible for positions, models and textures of pumpkin, skull, bruin statue (texture only), and plating the ground with grass. 
  
  
  For optimization, I lowered the complexity of collision detection. Since we only need to detect the collision between the bruin and obstacles, we can shrink the size of bruin to a point and increase the radius of each obstacle by the same amount. Then, we only need to check if the distance between the bruin and each obstacle is less than the obstacle's radius.  

### Shuo Yang    405427873
  From the game logic perspective, I developed start game, restart game functionalities and added end-game logic. In addition,  I optimized the obstacle and gold-point generation logic.
  
  From the graphics perspective, I was responsible for the position, model of bruin and position, model and texture of the skateboard. Besides, I added the spinning functionality of pumpkin and added three types of obstacles. Moreover, I was responsible for adding part of the name boards of buildings
### Yunpeng Ding 005430274

## Citation
[obj file of skull](https://www.turbosquid.com/FullPreview/Index.cfm/ID/1452999)

[obj file of pumpkin](https://www.turbosquid.com/FullPreview/Index.cfm/ID/776815)

[texture of grass](https://freerangestock.com/photos/121120/green-grass-texture-full-frame.html)


