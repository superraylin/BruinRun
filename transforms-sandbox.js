import {tiny, defs} from './common.js';
import {Shape_From_File} from './obj-file-demo.js';
                                                  // Pull these names into this module's scope for convenience:
const { Vector,vec3, vec4, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;
const { Torus,Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere, Capped_Cylinder } = defs;

export class Transforms_Sandbox_Base extends Scene
{
  constructor()
    {                  // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
      super();

      this.widget_options = {show_explanation: false ,make_code_nav: false};

      this.shapes = { "torus":  new Torus(15,15),
                       "box": new Cube(),
                       "ball": new Subdivision_Sphere(4),
                       "bear": new Shape_From_File("./assets/bear.obj"),
                       "skateboard": new Shape_From_File("./assets/skateboard_color.obj"),
                       "score_point": new Subdivision_Sphere(4),
                       "moore": new Shape_From_File( "assets/bina.obj" ),
                       "math": new Shape_From_File( "assets/math.obj" ),
                       "union": new Shape_From_File( "assets/union2.obj" ),
                       "powell": new Shape_From_File( "assets/powell.obj" ),
                       "e6": new Shape_From_File( "assets/e64.obj" ),
                       "e5": new Shape_From_File( "assets/e63.obj" ),
                       "kaufman": new Shape_From_File( "assets/kaufman.obj" ),
                       "royce": new Shape_From_File( "assets/royce.obj" ),
                       "act": new Shape_From_File( "assets/act.obj" ),
                       "letter_u": new U(),
                       "pumpkin":new Shape_From_File("assets/pumpkin.obj"),
                       "grass":new Shape_From_File("assets/grass.obj"),
                       "skull": new Shape_From_File("assets/skull.obj"),
                       "stair":new Shape_From_File("assets/stait.obj"),
                       "board": new board(),
                       "sign": new sign(),

                     }

      // this.stars = new Material( new defs.Textured_Phong( 1 ),  { color: color( .5,.5,.5,1 ),
      //     ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/ChurchBrick.png" ) });
      // this.bumps = new Material( new defs.Fake_Bump_Map( 1 ), { color: color( .5,.5,.5,1 ),
      //     ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/stars.png" ) });

      const phong = new defs.Phong_Shader(1);
      const bump = new defs.Fake_Bump_Map(1);
      const tphong = new defs.Textured_Phong(1);

      let rotate_count = 0;
      this.rotate_count = rotate_count;
      this.materials =
        { test:     new Material(phong,{ ambient: .2, diffusivity: 1, specularity: 0, color: color( 1,1,0,1 ) } ),

          ring:     new Material(phong),
          ice_gray: new Material(phong,{ ambient: .2, diffusivity: 1, specularity: 0, color: color(0.745,0.764,0.776,1) } ),

          swampy:   new Material(phong,{ ambient:0.2, diffusivity:0.4, specularity:1, color: color(0.01,0.196,0.125,1) } ),

          muddy:    new Material(phong,{ ambient:0.5, diffusivity:1, specularity:1, color: color(0.65,0.37,0.18,1) } ),

          lt_blue:  new Material(phong,{ ambient:0, diffusivity:1, specularity:0.8, color: color(0.15,0,0.69,1) } ),

          lt_gray:new Material(phong,{ ambient:0.5, diffusivity:0.5, specularity:0.5, color: color(0.83,0.83,0.83,1) } ),
          lt_gold: new Material(phong,{ ambient: 0.5, diffusivity: 0.5, specularity: 0.5, color: color(1, 0.83, 0,1)}),
          brick: new Material(bump,{ambient: 0.6, texture: new Texture( "assets/brick1.png" )}),
          road: new Material(bump,{ambient: 0.6, texture: new Texture( "assets/road4.png" )}),

          skateboard: new Material(bump, {ambient:0.5, texture: new Texture("assets/skateboard.jpg")}),
          bear: new Material( tphong, { ambient: 0.8, texture: new Texture("assets/fur.png")}),
          bear1: new Material( bump, { ambient: 0.6, diffusivity:0.2, specularity:0.5,color: color( 0.4,0.2,0,1 )}),
//           rocktexture: new Material(bump, { ambient: 1, texture: new Texture( "assets/rocktexture.jpg" )})
          rocktexture: new Material(bump,{ambient: 0.6, color: color( 1,0.5,0,1 )}),
//           bear: new Material( bump, {ambient:0.5, diffusivity:0.1, specularity:0.3, color: color(0.356,0.26,0.17,1)})
// color(0.246,0.164,0.08,1

          moore: new Material( new defs.Textured_Phong( 1 ),  { color: color( .8,.8,.5,1 ),
                  ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/road4.png" ) }),
          engr: new Material( phong,  { color: color( .8,.8,.5,1 ), ambient: .5, diffusivity: .5, specularity: .5}),
          stars: new Material( new defs.Textured_Phong( 1 ),  { color: color( .8,.8,.5,1 ),
                  ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/road4.png" ) }),
          powell: new Material( bump,  { color: color( .8,.8,.5,1 ),
                  ambient: .3, diffusivity: .3, specularity: .5, texture: new Texture( "assets/road4.png" ) }),
          letter: new Material(phong,{ ambient: 1, diffusivity: 1, specularity: 1, color: color( 0.325,0.408,0.584,1 ) } ),
          sk_white: new Material(phong,{ ambient: 0.5, diffusivity: 1, specularity: 1, color: color( 0.8,0.8,0.8,1 ) } ),
          orange: new Material(phong,{ ambient: 0.5, diffusivity: 0.5, specularity: 0.5, color: color( 1,0.5,0,1 ) } ),
          grass_obj: new Material(bump,{ ambient: 0.2, diffusivity: 0.8, specularity: 0.5, color: color( 0,1,0,1 ) } ),
          concrete: new Material( bump,  {ambient: 0.6, diffusivity: .3, specularity: .5, texture: new Texture( "assets/concrete.png" ) }),

          board_union: new Material(bump,{color: color( 0,0,0,1 ), ambient: 1, texture: new Texture( "assets/boards/union.jpg" )}),
          board_powell: new Material(bump,{color: color( 0,0,0,1 ), ambient: 1, texture: new Texture( "assets/boards/union.jpg" )}),
          grass: new Material(bump,{ambient: 0.5,diffusivity: .3, specularity: 0, texture: new Texture( "assets/grass2.jpg" )}),
          board_engr_6: new Material(bump,{color: color( 0,0,0,1 ), ambient: 1, texture: new Texture( "assets/boards/e6.jpg" )}),
          board_engr_5: new Material(bump,{color: color( 0,0,0,1 ), ambient: 1, texture: new Texture( "assets/boards/e5.jpg" )}),
          board_math: new Material(bump,{color: color( 0,0,0,1 ), ambient: 1, texture: new Texture( "assets/boards/math.jpg" )}),
          sign: new Material(phong,{ ambient: 0.5, diffusivity: 0.5, specularity: 0.5, color: color( 0.59,0.29,0,1 ) } )
        }

        this.coord = [25,3,0,0]; // coord[0] -- x, coord[1] -- y, coord[2] -- z, coord[3] -- if it's on a slop, 1 and -1 for yes, 0 for no.
        this.jump_t = 0;
        this.start = false;
        this.finish = false;
        this.obstacle_count = 0;
        this.point_count = 0;
        this.c_idx = 0; //last corner index
        // this.corner= [[[23,10,23],[23,10,-23],[-23,3,-23],[-23,3,23]],
        //               [[25,10,25],[25,10,-25],[-25,3,-25],[-25,3,25]],
        //               [[27,10,27],[27,10,-27],[-27,3,-27],[-27,3,27]]];
        this.corner= [[[23,10,21],[23,10,-23],[-23,3,-23],[-47,3,-23],[-47,3,21],[-23,3,21]],
                      [[25,10,23],[25,10,-25],[-25,3,-25],[-49,3,-25],[-49,3,23],[-25,3,23]],
                      [[27,10,25],[27,10,-27],[-27,3,-27],[-51,3,-27],[-51,3,25],[-27,3,25]]];
        this.obsticle_list = [] //store all collision obsticle_list item.
        this.score = 0
        this.bruin_speed = 10;
    }
  make_control_panel()
    {
//       this.key_triggered_button( "left", [ "1" ], () => {this.left_f = 1 ;this.right_f =0}   , "green",() => {this.left_f =  0;} );
      this.key_triggered_button( "left", [ "1" ], () => {
                                                          if(this.right_f > 0)
                                                            {this.left_f = 0 ;
                                                             this.right_f = 0;}
                                                          else
                                                            {this.left_f=1;
                                                             this.right_f=0}
                                                        });
      this.key_triggered_button( "jump", [ "2" ], () => this.up_f = 1     , "green",() => {} );
//       this.key_triggered_button( "right", [ "3" ],() => {this.right_f = 1; this.left_f = 0} , "green",() => {this.right_f = 0;});
      this.key_triggered_button( "right", [ "3" ],() => {
                                                          if(this.left_f > 0)
                                                            {this.right_f = 0;
                                                             this.left_f = 0}
                                                          else
                                                            {this.right_f = 1;
                                                             this.left_f = 0;}
                                                         });
     this.key_triggered_button("start", [ "4" ], () => {this.start = true});
     this.new_line();
      this.key_triggered_button( "speed up", [ "9" ],() => {this.bruin_speed += 5;});
      this.key_triggered_button( "speed down", [ "0" ],() => {this.bruin_speed -= 5;});
      this.key_triggered_button("reload", ["r"], () => {this.finish = false;
                                                        this.start = false;
      													this.coord = [15, 3, 0, 0];
      													this.obsticle_list = []
      													this.obstacle_count = 0;
      													this.point_count = 0;
      													this.score = 0;
      													this.c_idx = 0;
      													this.bruin_speed = 10;})
    }

  calc_height(nc_idx,c_idx,track_idx,x_loc){
    let base_height = 0;
    let height_diff = this.corner[track_idx][nc_idx][1] -this.corner[track_idx][c_idx][1];
    let base_dist = this.corner[0][nc_idx][0] -this.corner[0][c_idx][0]; //calcuate distance of inner track

    if(height_diff != 0){
      if(height_diff < 0) {
        this.coord[3] = 1;
      } else {
        this.coord[3] = -1;
      }
      let low_plane_idx = (Math.sign(height_diff) == -1) ? nc_idx:c_idx ; //choose lower plane as reference

      base_height = (x_loc-this.corner[0][low_plane_idx][0])/Math.abs(base_dist)* Math.abs(height_diff)+3;
    }else {
      base_height = this.corner[track_idx][nc_idx][1];
      this.coord[3] = 0;
    }

    if(base_height>10) base_height =10;
    if(base_height<3) base_height =3;

    return base_height;
  }

  /**
   * @param num_obstacles: number of obstacles to create
   * @param gold_points: number of gold_points to create
   */
  create_obstacle(num_obstacles, gold_points){

      if(this.obstacle_count<num_obstacles){
        let locs = [[0,3,0]];
        let rand = Math.random()
        let rand_track = Math.floor((Math.random()*this.corner.length)%this.corner.length);
        let rand_corner = Math.floor((Math.random()*this.corner[0].length) %this.corner[0].length);
        let rand_nxcorner = (rand_corner+1)% this.corner[0].length;
        let track_change = Vector.from(this.corner[rand_track][rand_nxcorner]).minus(Vector.from(this.corner[rand_track][rand_corner]));
        track_change = track_change.times(rand);
        let type = 0;
        if(rand <= 0.3) {
          type = 2;  // create obstacle in three tracks.
        } else if(rand > 0.3 && rand <= 0.9) {
          type = 1; // create obstacle in two tracks.
        } else {
          type = 0; // create obstacle in one track.
        }
        switch(type) {
          case(2):
                  locs[1] = [0,3,0];
                  locs[2] = [0,3,0];
                  if(track_change[2] === 0) {
                    for(var i = 0; i < 3; i++) {
                      locs[i][2] = this.corner[i][rand_nxcorner][2];
                      locs[i][0] = track_change[0]+this.corner[rand_track][rand_corner][0];
                    }
                  } else {
                    for(var i = 0; i < 3; i++) {
                      locs[i][0] = this.corner[i][rand_nxcorner][0];
                      locs[i][2] = track_change[2]+this.corner[rand_track][rand_corner][2]
                    }
                  }
                  for(var i = 0; i < 3; i++) {
                    locs[i][1] = this.calc_height(rand_nxcorner,rand_corner,rand_track,locs[i][0]);
                  }
                  break;
          case(1):
                  locs[1] = [0,3,0];
                  if(track_change[2] === 0) {
                    for(var i = 0; i < 2; i++) {
                      locs[i][2] = this.corner[(rand_track + Math.floor(Math.random() * 2 + 1)) % 3][rand_nxcorner][2];
                      locs[i][0] = track_change[0]+this.corner[rand_track][rand_corner][0];
                    }
                  } else {
                    for(var i = 0; i < 2; i++) {
                      locs[i][0] = this.corner[(rand_track + Math.floor(Math.random() * 2 + 1)) % 3][rand_nxcorner][0];
                      locs[i][2] = track_change[2]+this.corner[rand_track][rand_corner][2]
                    }
                  }
                  for(var i = 0; i < 2; i++) {
                    locs[i][1] = this.calc_height(rand_nxcorner,rand_corner,rand_track,locs[i][0]);
                  }
                  break;
          case(0):
                 if(track_change[2] ===0) {
                   locs[0][2] = this.corner[rand_track][rand_nxcorner][2];
                   locs[0][0] = track_change[0]+this.corner[rand_track][rand_corner][0]
                 } else {
                   locs[0][0] = this.corner[rand_track][rand_nxcorner][0];
                   locs[0][2] = track_change[2]+this.corner[rand_track][rand_corner][2]
                 }
                 locs[0][1] = this.calc_height(rand_nxcorner,rand_corner,rand_track,locs[0][0]);
                 break;
        }
          let flag = true;
          for(var i = locs.length - 1; i >= 0; i--) {
            if(this.collision_test(locs[i]) != -1) {
              flag = false;
              break;
            }
          }

          if(flag) {
            let ob_param = { location: locs, bounding:2, goodbad: 0};
            this.obsticle_list.push(ob_param);
            this.obstacle_count += 1;
          }
    }
    if(this.point_count < gold_points) {
      let rand = Math.random()
      let num = Math.floor(Math.random() * 6);
      let locs = [[0,3,0]];
      let rand_track = Math.floor((Math.random()*this.corner.length)%this.corner.length);
      let rand_corner = Math.floor((Math.random()*this.corner[0].length) %this.corner[0].length);
      let rand_nxcorner = (rand_corner+1)% this.corner[0].length;
      let track_change = Vector.from(this.corner[rand_track][rand_nxcorner]).minus(Vector.from(this.corner[rand_track][rand_corner]));
      track_change = track_change.times(rand);
      if(track_change[2] ===0) {
        locs[0][2] = this.corner[rand_track][rand_nxcorner][2];
        locs[0][0] = track_change[0]+this.corner[rand_track][rand_corner][0];
      } else {
        locs[0][0] = this.corner[rand_track][rand_nxcorner][0];
        locs[0][2] = track_change[2]+this.corner[rand_track][rand_corner][2];
      }
        locs[0][1] = this.calc_height(rand_nxcorner,rand_corner,rand_track,locs[0][0]);
        if(this.collision_test(locs[0], 0) === -1) {
          let ob = {location: locs, bounding:2, goodbad: 1};
          this.obsticle_list.push(ob);
          this.point_count += 1;
        }
    }
  }





    //locations, orientation, ..., bounding box size, good_or_bad

  /**
   * @param bodytest: 1 for bear test, 0 for obstacle/gold_points test
   * @param test_point: test position
   */
  collision_test(test_point, bodytest=1){
      let index = -1;
      for(var i = 0; i< this.obsticle_list.length;i++){
        let rad = this.obsticle_list[i].bounding;
        for(var j = 0; j < this.obsticle_list[i].location.length; j++) {
          let inside = this.obsticle_list[i].location[j].every((n,p)=>Math.abs(n-test_point[p])<rad); //if inside bounding for all
          if(inside && this.obsticle_list[i].goodbad){
            this.score +=1;
            index = i;
            if(bodytest) {
              this.point_count -= 1;
            }
            break
          }else if(inside && !this.obsticle_list[i].goodbad){
            if(bodytest) {
              this.finish = true;
            }
            index = i;
            break;
          }
        }
      }
      return index;

    }
  bruin_control(dt){
    /**********User Input control********/
    let track_idx = 1;
    //select track base on input
    if(this.left_f){
      track_idx = 0;
    }else if(this.right_f){
      track_idx = 2;
    }

    //change coord base on direction
    let nc_idx = (this.c_idx+1)% this.corner[0].length; //next corner index
    let dir = this.corner[track_idx][nc_idx].map((n,i)=> Math.sign(n- this.corner[track_idx][this.c_idx][i]));
    let theta = 0; //orientation

    let speed = this.bruin_speed;

    switch(true){
      case dir[0] == -1:
                    if(this.start && !this.finish) {
                      this.coord[0] -= speed*dt;
                    }
                    theta = Math.PI/2;
                    if ( (this.corner[track_idx][nc_idx][0] - this.coord[0]) >=0 ) this.c_idx = nc_idx;
                    this.coord[2] = this.corner[track_idx][nc_idx][2];
                    break;

      case dir[0] == 1:
                    if(this.start && !this.finish) {
                      this.coord[0] += speed*dt;
                    }
                    theta = -Math.PI/2;
                    if ( (this.coord[0] -this.corner[track_idx][nc_idx][0]) >=0 ) this.c_idx = nc_idx;
                    this.coord[2] = this.corner[track_idx][nc_idx][2];
                    break;

      case dir[2] == -1:
                    if(this.start && !this.finish) {
                      this.coord[2] -= speed*dt;
                    }
                    theta = 0;
                    if ((this.corner[track_idx][nc_idx][2] - this.coord[2]) >=0 ) this.c_idx = nc_idx;
                    this.coord[0] = this.corner[track_idx][nc_idx][0];
                    break;

      case dir[2] ==1:
                    if(this.start && !this.finish) {
                      this.coord[2] += speed*dt;
                    }
                    theta = Math.PI;
                    if ((this.coord[2] -this.corner[track_idx][nc_idx][2]) >=0 ) this.c_idx = nc_idx;
                    this.coord[0] = this.corner[track_idx][nc_idx][0];
                    break;

    }

    //calculate base height on stair

    let base_height = this.calc_height(nc_idx,this.c_idx,track_idx,this.coord[0])
//     console.log(base_height);

    //calcualte jump
    let height = 0;
    if(this.up_f){
       height = base_height+ 10 * this.jump_t *2 - 4*9.8/2*this.jump_t*this.jump_t; //x = x + vt + 1/2at^2
       this.jump_t += dt;
    }
    if(height<base_height){
      this.jump_t = 0;
      this.up_f = 0;
      height = base_height;
    }
    this.coord[1] =height;


    return theta;
  }

  drawBruin(context, program_state,locs,ori){
        let s_correct = 0;
        if(locs[1] == 10) {
          s_correct = -1.3;
        } else if(locs[1] == 3) {
          s_correct = -0.3;
        } else {
          s_correct = -0.7;
        }
        let b_correct = s_correct + 1.6;

        let model = Mat4.identity().times(Mat4.translation(locs[0],locs[1],locs[2])).times(Mat4.rotation(ori,0,1,0));
        let skateboard_transform = Mat4.identity().times(Mat4.translation(locs[0],locs[1],locs[2]))
                                       .times(Mat4.translation(0, s_correct, 0))
                                       .times(Mat4.rotation(ori,0,1,0))
                                       .times(Mat4.rotation(Math.PI, 0,1,0))
                                       .times(Mat4.rotation(-Math.PI / 2, 1, 0 ,0))
                                       .times(Mat4.rotation(locs[3] * 0.1489, 1, 0, 0));

        let bear_transform = Mat4.identity().times(Mat4.translation(locs[0],locs[1],locs[2]))
                                        .times(Mat4.translation(0, b_correct, 0))
                                        .times(Mat4.rotation(ori,0,1,0))
                                        .times(Mat4.rotation(Math.PI, 0,1,0))
                                        .times(Mat4.rotation(locs[3] * 0.1489, 1, 0, 0));
        //model = model.times(this.attached());
//         this.shapes.torus.draw(context,program_state,model,this.materials.test);
//         this.shapes.ball.draw(context,program_state,model.times(Mat4.translation(0,0,1)),this.materials.lt_gray );
        this.shapes.bear.draw(context, program_state, bear_transform, this.materials.bear);
        this.shapes.skateboard.draw(context, program_state, skateboard_transform, this.materials.skateboard);

        return model
    }

  drawObstacle(context, program_state,locs,ori,rad,g_b){
        for(var i = 0; i < locs.length; i ++) {
          let model = Mat4.identity().times(Mat4.translation(locs[i][0],locs[i][1],locs[i][2])).times(Mat4.rotation(ori,0,1,0));
          let gold_model = Mat4.identity().times(Mat4.translation(locs[i][0],locs[i][1] + 1,locs[i][2]))
                                          .times(Mat4.rotation(ori,0,1,0))
                                          .times(Mat4.scale(0.45,0.45,0.45))
                                          .times(Mat4.rotation(this.rotate_count * Math.PI / 45, 0, 1, 0));
          if(g_b){
            this.shapes.pumpkin.draw(context, program_state, gold_model,this.materials.orange);
          }
          else {
              let adj_ori = Mat4.identity();
              if(locs[i][2] == -23 || locs[i][2] == -25 || locs[i][2] == -27) {
                  adj_ori = adj_ori.times(Mat4.rotation(Math.PI / 2, 0, 1, 0));
              } else if (locs[i][2] == 21 || locs[i][2] == 23 || locs[i][2] == 25) {
                  adj_ori = adj_ori.times(Mat4.rotation(-Math.PI / 2, 0, 1, 0));
              } else if (locs[i][0] == -47 || locs[i][0] == -49 || locs[i][0] == -51) {
                  adj_ori = adj_ori.times(Mat4.rotation(Math.PI, 0, 1, 0));
              }
              this.shapes.skull.draw(context, program_state,model.times(adj_ori),this.materials.sk_white);
          }
        }
    }

  drawRoad(context, program_state,model){

      this.shapes.box.draw(context, program_state, model.times(Mat4.scale(6,1,6)),this.materials.road);
      let road_model = model.times(Mat4.translation(0,0,12))
      return road_model
  }

  drawRamp(context, program_state,model,material){

      this.shapes.box.draw(context, program_state, model.times(Mat4.scale(3.3,1,3)).times(Mat4.rotation(Math.PI/2,0,1,0)),material);
      let ramp_model = model.times(Mat4.translation(6.6,0,0));
      return ramp_model
  }

  drawGrass(context, program_state,model,dir = 'z'){
    let grass_model = model;
    this.shapes.box.draw(context, program_state, model.times(Mat4.scale(6,1,6)) , this.materials.grass);
    if(dir == 'z')  return model.times(Mat4.translation(0,0,12));
    else return model.times(Mat4.translation(12,0,0));


  }


  display( context, program_state )
    {
//         console.log(this.obsticle_list)
//       return;
     // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
      if( !context.scratchpad.controls )
        { this.children.push( context.scratchpad.controls = new defs.Movement_Controls() );
          program_state.set_camera( Mat4.rotation(Math.PI/2,1,0,0).times(Mat4.translation( 0,-100,0 )) );
        }

      program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 500 );
      const t = this.t = program_state.animation_time/1000,dt = program_state.animation_delta_time / 1000;
      program_state.lights = [new Light( Vector.of( 0,50,0,1 ), color( 1,1,1,1),1000) ];



      //update location and return orientation of bruin
      let bruin_theta = this.bruin_control(dt);


      // /*****draw all obstacles*******/
      this.create_obstacle(5,10); //create 10 obstacle
//       console.log(this.obsticle_list);
      let _this  = this;
      this.rotate_count = (this.t*10) % 180;
      this.obsticle_list.forEach(function(item){
        _this.drawObstacle(context, program_state,item.location,0,item.bounding,item.goodbad);
      });

      //draw main character
//       console.log(this.coord)
      let bruin_mat = this.drawBruin(context, program_state,this.coord,bruin_theta);

      // //collision test and remove collided item
      let collide_idx = this.collision_test(this.coord);
      if(collide_idx !== -1) this.obsticle_list.splice(collide_idx,1);

      //document.querySelector( "#score" ).text("score:" + String(this.score));
      if(!this.finish) {
        $("#score").text("score:" + String(this.score));
      } else {
        $("#score").text("Game Over, Your Final Score is " + String(this.score));
      }



      /*****Ground*****/

      // this.shapes.box.draw(context, program_state, Mat4.translation(0,4,0).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,40)), this.materials.grass);
      // this.shapes.box.draw(context, program_state, Mat4.translation(39,7.05,0).times(Mat4.scale(20,1,40)), this.materials.grass);
      // this.shapes.box.draw(context, program_state, Mat4.translation(-39.7,0.9,0).times(Mat4.scale(20,1,40)), this.materials.grass);

      /******Buildings******/
      //Letter
      this.shapes.letter_u.draw( context, program_state, Mat4.translation(32,10,-28), this.materials.letter );

      //Ackman board
      this.shapes.board.draw( context, program_state, Mat4.translation(-22,3,17).times(Mat4.rotation(-1.5*Math.PI, 0,1,0)), this.materials.board_union );
      this.shapes.sign.draw( context, program_state, Mat4.translation(-22,3,16.75).times(Mat4.rotation(Math.PI, 0, 1, 0)), this.materials.sign);
      //Powell board
      this.shapes.board.draw( context, program_state, Mat4.translation(-22,3,17).times(Mat4.rotation(-1.5*Math.PI, 0,1,0)), this.materials.board_union );
      this.shapes.sign.draw( context, program_state, Mat4.translation(-22,3,16.75).times(Mat4.rotation(Math.PI, 0, 1, 0)), this.materials.sign);

      //Engineering VI board
      this.shapes.board.draw( context, program_state, Mat4.translation(-35,3,29).times(Mat4.rotation(-Math.PI / 2,0,1,0)), this.materials.board_engr_6 );
      this.shapes.sign.draw( context, program_state, Mat4.translation(-35,3,29.205), this.materials.sign);

      //Engineering V board
      this.shapes.board.draw( context, program_state, Mat4.translation(-19,3.58,29).times(Mat4.rotation(-Math.PI / 2,0,1,0)), this.materials.board_engr_5 );
      this.shapes.sign.draw( context, program_state, Mat4.translation(-19,3.58,29.205), this.materials.sign);

      //Math Building board
      this.shapes.board.draw( context, program_state, Mat4.translation(11.8,8,28).times(Mat4.rotation(-Math.PI / 2,0,1,0)), this.materials.board_math );
      this.shapes.sign.draw( context, program_state, Mat4.translation(11.8,8,28.205), this.materials.sign);


      //MOORE
      this.shapes.moore.draw( context, program_state, Mat4.translation(12,10,10).times(Mat4.scale(6,6,12)), this.materials.moore  );

      //Math Building
      let mat_math_building = Mat4.translation(14,10,34);
      mat_math_building = mat_math_building.times(Mat4.rotation(1.5 * Math.PI,0,-1,0));
      mat_math_building = mat_math_building.times(Mat4.scale(3,6,15));
      this.shapes.math.draw( context, program_state, mat_math_building, this.materials.stars  );

      //Union
       let mat_union = Mat4.translation(-30,8,12);
       mat_union = mat_union.times(Mat4.scale(6,6,6));
       this.shapes.union.draw( context, program_state, mat_union, this.materials.stars  );

       //Powell
       let mat_library = Mat4.translation(7,10,-13).times(Mat4.rotation(Math.PI,0,1,0)).times(Mat4.scale(6,6,6));
       this.shapes.powell.draw( context, program_state, mat_library, this.materials.moore  );

       //Royce
       let mat_royce = Mat4.translation(7,9,-32).times(Mat4.scale(10,6,6));
       this.shapes.royce.draw( context, program_state, mat_royce, this.materials.moore  );

       //Engineering VI & V
       this.shapes.e6.draw( context, program_state, Mat4.translation(-34,6,36).times(Mat4.rotation(0.5*Math.PI,0,1,0)).times(Mat4.scale(4,6,8)), this.materials.moore  );
       this.shapes.e5.draw( context, program_state, Mat4.translation(-10,8,34).times(Mat4.rotation(-0.25*Math.PI,0,1,0)).times(Mat4.scale(6,6,6)), this.materials.moore  );

       //Kaufman
       this.shapes.kaufman.draw( context, program_state, Mat4.translation(-34,6,-12).times(Mat4.scale(6,6,6)), this.materials.stars  );

       //Student activity center
       this.shapes.act.draw( context, program_state, Mat4.translation(-34,4,-32).times(Mat4.scale(6,6,6)), this.materials.stars  );

    /*****Grass**/
      //  this.shapes.box.draw(context, program_state, Mat4.translation(-18,1.2,-13).times(Mat4.scale(6,1,6)) , this.materials.grass);
    //this.shapes.grass.draw(context, program_state, Mat4.translation(-18,2,-13).times(Mat4.rotation(-0.5*Math.PI,1,0,0)).times(Mat4.scale(4,4,6)) , this.materials.grass_obj)



      /*********grass********/
      this.shapes.box.draw(context, program_state, Mat4.translation(0,4,-22).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,21)), this.materials.grass);
      this.shapes.box.draw(context, program_state, Mat4.translation(0,4,20).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,21)), this.materials.grass);

      let grass_model = Mat4.translation(-37,1.2,-13);
      for (let i = 0; i< 3; i++){
        grass_model = this.drawGrass(context, program_state, grass_model);
      }
      grass_model = Mat4.translation(-25,1.2,-13);
      for (let i = 0; i< 3; i++){
        grass_model = this.drawGrass(context, program_state, grass_model);
      }

      grass_model = Mat4.translation(-61,1.2,-37);
      for (let i = 0; i< 7; i++){
        grass_model = this.drawGrass(context, program_state, grass_model);
      }

      grass_model = Mat4.translation(-49,1.2,-37);
      for (let i = 0; i< 3; i++){
        grass_model = this.drawGrass(context, program_state, grass_model,'x');
      }

      grass_model = Mat4.translation(-49,1.2,35);
      for (let i = 0; i< 3; i++){
        grass_model = this.drawGrass(context, program_state, grass_model,'x');
      }

      grass_model = Mat4.translation(37,7.1,-37);
      for (let i = 0; i< 7; i++){
        grass_model = this.drawGrass(context, program_state, grass_model);
      }

      grass_model = Mat4.translation(49,7.1,-37);
      for (let i = 0; i< 7; i++){
        grass_model = this.drawGrass(context, program_state, grass_model);
      }
      grass_model = Mat4.translation(61,7.1,-37);
      for (let i = 0; i< 7; i++){
        grass_model = this.drawGrass(context, program_state, grass_model);
      }

      this.drawGrass(context,program_state,Mat4.translation(25,7.1,-37));
      this.drawGrass(context,program_state,Mat4.translation(25,7.1,35));



      /****Ramp*****/
      let ramp_model = Mat4.rotation(Math.PI/20,0,0,1).times(Mat4.translation(-16,4.3,-25));
      for (let i = 0; i< 6; i++){
        ramp_model = this.drawRamp(context, program_state,ramp_model,this.materials.brick);
      }

      ramp_model = Mat4.rotation(Math.PI/20,0,0,1).times(Mat4.translation(-16,4.3,23));
      for (let i = 0; i< 6; i++){
        ramp_model = this.drawRamp(context, program_state,ramp_model,this.materials.concrete);
      }

      /******Road*****/
      let road_model = Mat4.translation(25,7.5,-25);
      for (let i = 0; i< 5; i++){
        road_model = this.drawRoad(context, program_state,road_model);
      }

      this.drawRoad(context, program_state,Mat4.translation(-25,1.5,-25));
      this.drawRoad(context, program_state,Mat4.translation(-25,1.5,23))
      this.drawRoad(context, program_state,Mat4.translation(-37,1.5,-25));
      this.drawRoad(context, program_state,Mat4.translation(-37,1.5,23))
      road_model = Mat4.translation(-49,1.5,-25);
      for (let i = 0; i< 5; i++){
        road_model = this.drawRoad(context, program_state,road_model)
      }

      /******camera matrix******/
      let camera_model = bruin_mat.times(Mat4.translation(0,8,8)).times(Mat4.rotation(-Math.PI/8,1,0,0));
      camera_model = Mat4.inverse(camera_model);
      camera_model = camera_model.map( (x,i) => Vector.from( program_state.camera_inverse[i] ).mix( x, 0.05 ) )
      program_state.set_camera(camera_model);

    }
}

const U = defs.U =
class U extends Shape {
  constructor() {
    super( "position", "normal", "texture_coord" );

    let Mat_trans = Mat4.identity();

    //U
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    for(var i = 0; i < 3; i++) {
      Mat_trans = Mat_trans.times(Mat4.translation(0,2,0));
      Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
      Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans.times(Mat4.translation(0,0,4)));
    }
    Mat_trans = Mat_trans.times(Mat4.translation(0,-6,2));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans.times(Mat4.translation(0,0,2)));


    //C
    Mat_trans = Mat_trans.times(Mat4.translation(0,0,6));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    for(var i = 0; i < 3; i++) {
      Mat_trans = Mat_trans.times(Mat4.translation(0,2,0));
      Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    }
    Mat_trans = Mat_trans.times(Mat4.translation(0,-6,2));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans.times(Mat4.translation(0,6,0)));
    Mat_trans = Mat_trans.times(Mat4.translation(0,0,2));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans.times(Mat4.translation(0,6,0)));


    //L
    Mat_trans = Mat_trans.times(Mat4.translation(0,0,4));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    for(var i = 0; i < 3; i++) {
      Mat_trans = Mat_trans.times(Mat4.translation(0,2,0));
      Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    }
    Mat_trans = Mat_trans.times(Mat4.translation(0,-6,2));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans.times(Mat4.translation(0,0,2)));

    //A
    Mat_trans = Mat_trans.times(Mat4.translation(0,0,6));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    for(var i = 0; i < 3; i++) {
      Mat_trans = Mat_trans.times(Mat4.translation(0,2,0));
      Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
      Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans.times(Mat4.translation(0,0,4)));
    }
    Mat_trans = Mat_trans.times(Mat4.translation(0,0,2));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans.times(Mat4.translation(0,-4,0)));
    Mat_trans = Mat_trans.times(Mat4.translation(0,0,2));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans.times(Mat4.translation(0,-4,0)));
    Mat_trans = Mat_trans.times(Mat4.translation(0,0-6,0));
    Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
  }
}

// const C = defs.C =
// class C extends Shape {
//   constructor() {


//   }
// }

const board = defs.board =
class board extends Shape {
    constructor() {
        super( "position", "normal", "texture_coord" );
        let Mat_trans = Mat4.identity().times(Mat4.translation(0,2,0)).times(Mat4.rotation(1.5 * Math.PI,0,1,0)).times(Mat4.scale(3.56,1.65,1));
        Square.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    }
}

const sign = defs.sign =
class sign extends Shape {
    constructor() {
        super( "position", "normal", "texture_coord" );
        let rod_trans = Mat4.identity().times(Mat4.rotation(Math.PI / 2 , 1, 0, 0)).times(Mat4.scale(0.2,0.2,2));
        Capped_Cylinder.insert_transformed_copy_into(this, [15,15],rod_trans);
        let Mat_trans = Mat4.identity().times(Mat4.translation(0,2,0)).times(Mat4.scale(3.56,1.65,0.2));
        Cube.insert_transformed_copy_into(this, ["position", "normal", "texture_coord"], Mat_trans);
    }
}
