import {tiny, defs} from './common.js'
import {Shape_From_File} from "./obj-file-demo.js"
                                                  // Pull these names into this module's scope for convenience:
const { Vector,vec3, vec4, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;
const { Torus,Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere } = defs;

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
                       "rock": new Shape_From_File("/assets/rock.obj")

                     }

      const phong = new defs.Phong_Shader(1);
      const bump = new defs.Fake_Bump_Map(1);
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
          road: new Material(bump,{ambient: 0.6, texture: new Texture( "assets/road4.png" )}),
          grass: new Material(bump,{ambient: 0.5, texture: new Texture( "assets/grass.png" )}),
          skateboard: new Material(bump, {ambient:0.5, texture: new Texture("assets/skateboard.jpg")}),
          bear: new Material( bump, { ambient: 1, texture: new Texture("assets/bear-color.png")}),
//           rocktexture: new Material(bump, { ambient: 1, texture: new Texture( "assets/rocktexture.jpg" )})
          rocktexture: new Material(bump,{ambient: 0.6, texture: new Texture( "assets/rocktexture.jpg" )})
//           bear: new Material( bump, {ambient:0.5, diffusivity:0.1, specularity:0.3, color: color(0.356,0.26,0.17,1)})
// color(0.246,0.164,0.08,1


        }

        this.coord = [15,3,0,0]; // coord[0] -- x, coord[1] -- y, coord[2] -- z, coord[3] -- if it's on a slop, 1 and -1 for yes, 0 for no.
        this.jump_t = 0;
        this.obstacle_count = 0;
        this.point_count = 0;
        this.total_obstacle = 0;
        this.total_point =0;
        this.c_idx = 0; //last corner index
        // this.corner= [[[23,10,23],[23,10,-23],[-23,3,-23],[-23,3,23]],
        //               [[25,10,25],[25,10,-25],[-25,3,-25],[-25,3,25]],
        //               [[27,10,27],[27,10,-27],[-27,3,-27],[-27,3,27]]];
        this.corner= [[[23,10,21],[23,10,-23],[-23,3,-23],[-47,3,-23],[-47,3,21],[-23,3,21]],
                      [[25,10,23],[25,10,-25],[-25,3,-25],[-49,3,-25],[-49,3,23],[-25,3,23]],
                      [[27,10,25],[27,10,-27],[-27,3,-27],[-51,3,-27],[-51,3,25],[-27,3,25]]];
        this.obsticle_list = [] //store all collision obsticle_list item.
        this.score = 0
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


  create_obstacle(num_obstacles, gold_points){

      if(this.obstacle_count<num_obstacles){
        let locs = [[0,3,0]];
        let rand = Math.random()
        let rand_track = Math.floor((Math.random()*this.corner.length)%this.corner.length);
        let rand_corner = Math.floor((Math.random()*this.corner[0].length) %this.corner[0].length);
        let rand_nxcorner = (rand_corner+1)% this.corner[0].length;
        let r_sign = Math.random()>0.5? -1: 1;
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
//         console.log(type);
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
//         if(this.collision_test(locs) === -1) {
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
//         }
    }
    if(this.point_count < gold_points) {
      let rand = Math.random()
      let num = Math.floor(Math.random() * 6);
      let locs = [[0,3,0]];
      let rand_track = Math.floor((Math.random()*this.corner.length)%this.corner.length);
      let rand_corner = Math.floor((Math.random()*this.corner[0].length) %this.corner[0].length);
      let rand_nxcorner = (rand_corner+1)% this.corner[0].length;
      let r_sign = Math.random()>0.5? -1: 1;
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
  
//         let rand = Math.random()
//         let r_sign = Math.random()>0.5? -1: 1;
//         let locs = [0,3,0];

//         let rand_track = Math.floor((Math.random()*this.corner.length)%this.corner.length);
//         let rand_corner = Math.floor((Math.random()*this.corner[0].length) %this.corner[0].length);
//         let rand_nxcorner = (rand_corner+1)% this.corner[0].length;

//         let track_change = Vector.from(this.corner[rand_track][rand_nxcorner]).minus(Vector.from(this.corner[rand_track][rand_corner]));
//         track_change = track_change.times(rand); //here is the problem


//         if(track_change[2] ===0) {
//           locs[2] = this.corner[rand_track][rand_nxcorner][2];
//           locs[0] = track_change[0]+this.corner[rand_track][rand_corner][0]
//         }
//         else {
//           locs[0] = this.corner[rand_track][rand_nxcorner][0];
//           locs[2] = track_change[2]+this.corner[rand_track][rand_corner][2]
//         }

//         locs[1] = this.calc_height(rand_nxcorner,rand_corner,rand_track,locs[0]);

//         if(this.collision_test(locs) === -1){
//           let ob_param = { location: locs,
//                             bounding: 2,
//                             goodbad: rand>0.5};

//           this.obsticle_list.push(ob_param);
//         }




    //locations, orientation, ..., bounding box size, good_or_bad


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
            this.score -=1;
            if(bodytest) {
              this.obstacle_count -= 1;
            }
            index = i;
            break;
          }
        }
      }
      return index;
//       let index = -1;
//       for(var i = 0; i< this.obsticle_list.length;i++){
//         let rad = this.obsticle_list[i].bounding;
//         let inside = this.obsticle_list[i].location.every((n,j)=>Math.abs(n-test_point[j])<rad); //if inside bounding for all
//         if(inside && this.obsticle_list[i].goodbad){
//           this.score +=1;
//           index = i;
//         }else if(inside && !this.obsticle_list[i].goodbad){
//           this.score -=1;
//           index = i;
//         }
//       }
//       return index;
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

    switch(true){
      case dir[0] == -1:
                    this.coord[0] -= 10*dt;
                    theta = Math.PI/2;
                    if ( (this.corner[track_idx][nc_idx][0] - this.coord[0]) >=0 ) this.c_idx = nc_idx;
                    this.coord[2] = this.corner[track_idx][nc_idx][2];
                    break;

      case dir[0] == 1:
                    this.coord[0] += 10*dt;
                    theta = -Math.PI/2;
                    if ( (this.coord[0] -this.corner[track_idx][nc_idx][0]) >=0 ) this.c_idx = nc_idx;
                    this.coord[2] = this.corner[track_idx][nc_idx][2];
                    break;

      case dir[2] == -1:
                    this.coord[2] -= 10*dt;
                    theta = 0;
                    if ((this.corner[track_idx][nc_idx][2] - this.coord[2]) >=0 ) this.c_idx = nc_idx;
                    this.coord[0] = this.corner[track_idx][nc_idx][0];
                    break;

      case dir[2] ==1:
                    this.coord[2] += 10*dt;
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
    //console.log(base_height);


    return theta;
  }

  drawBruin(context, program_state,locs,ori){
//         console.log(locs[1])
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
            this.shapes.box.draw(context, program_state, gold_model,this.materials.lt_gold);
          }
          else {this.shapes.box.draw(context, program_state,model,this.materials.rocktexture); }
        }
    }

  drawRoad(context, program_state,model){

      this.shapes.box.draw(context, program_state, model.times(Mat4.scale(6,1,6)),this.materials.road);
      let road_model = model.times(Mat4.translation(0,0,12))
      return road_model
  }


  display( context, program_state )
    {
//       console.log(this.point_count);
      console.log(this.obsticle_list);
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
      let _this  = this;
      this.rotate_count = (this.rotate_count + 1) % 45;
      this.obsticle_list.forEach(function(item){
        _this.drawObstacle(context, program_state,item.location,0,item.bounding,item.goodbad);
      });

      //draw main character
      let bruin_mat = this.drawBruin(context, program_state,this.coord,bruin_theta);

      // //collision test and remove collided item
      let collide_idx = this.collision_test(this.coord);
//       console.log(collide_idx);
//       console.log(this.obsticle_list)
      if(collide_idx !== -1) this.obsticle_list.splice(collide_idx,1);

      //document.querySelector( "#score" ).text("score:" + String(this.score));
      $("#score").text("score:" + String(this.score));




      /*****Ground*****/
      this.shapes.box.draw(context, program_state, Mat4.translation(0,4,0).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,40)), this.materials.test);
      this.shapes.box.draw(context, program_state, Mat4.translation(39,7.05,0).times(Mat4.scale(20,1,40)), this.materials.test);
      this.shapes.box.draw(context, program_state, Mat4.translation(-39.7,0.9,0).times(Mat4.scale(20,1,40)), this.materials.test);

      /*****Grass**/
      this.shapes.box.draw(context, program_state, Mat4.translation(-37,1.2,-13).times(Mat4.scale(6,1,6)) , this.materials.grass);

      /****Stair*****/
      this.shapes.box.draw(context, program_state, Mat4.translation(0,4.5,23).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,3)),this.materials.muddy);
      this.shapes.box.draw(context, program_state, Mat4.translation(0,4.5,-25).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,3)),this.materials.muddy);

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
      let camera_model = bruin_mat.times(Mat4.translation(0,5,5)).times(Mat4.rotation(-Math.PI/8,1,0,0));
      camera_model = Mat4.inverse(camera_model);
      camera_model = camera_model.map( (x,i) => Vector.from( program_state.camera_inverse[i] ).mix( x, 0.05 ) )
      program_state.set_camera(camera_model);

    }
}
