import {tiny, defs} from './common.js';
import {Shape_From_File} from './obj-file-demo.js';

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
                       "moore": new Shape_From_File( "assets/bina.obj" ),
                       "math": new Shape_From_File( "assets/math.obj" ),
                       "union": new Shape_From_File( "assets/union2.obj" ),
                       "powell": new Shape_From_File( "assets/powell.obj" ),
                       "e6": new Shape_From_File( "assets/e6.obj" ),
                       "e5": new Shape_From_File( "assets/e5.obj" ),
                       "kaufman": new Shape_From_File( "assets/kaufman.obj" ),
                       "royce": new Shape_From_File( "assets/royce.obj" ),
                       "act": new Shape_From_File( "assets/act.obj" ),
                       "letter_u": new U(),
//                        "letter_c": new C(),

                     }

      this.stars = new Material( new defs.Textured_Phong( 1 ),  { color: color( .5,.5,.5,1 ), 
          ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/ChurchBrick.png" ) });
      this.bumps = new Material( new defs.Fake_Bump_Map( 1 ), { color: color( .5,.5,.5,1 ), 
          ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/stars.png" ) });

      const phong = new defs.Phong_Shader(1);
      const bump = new defs.Fake_Bump_Map(1);

      this.materials =
        { test:     new Material(phong,{ ambient: .2, diffusivity: 1, specularity: 0, color: color( 1,1,0,1 ) } ),

          ring:     new Material(phong),
          ice_gray: new Material(phong,{ ambient: .2, diffusivity: 1, specularity: 0, color: color(0.745,0.764,0.776,1) } ),

          swampy:   new Material(phong,{ ambient:0.2, diffusivity:0.4, specularity:1, color: color(0.01,0.196,0.125,1) } ),

          muddy:    new Material(phong,{ ambient:0.5, diffusivity:1, specularity:1, color: color(0.65,0.37,0.18,1) } ),

          lt_blue:  new Material(phong,{ ambient:0, diffusivity:1, specularity:0.8, color: color(0.15,0,0.69,1) } ),

          lt_gray:new Material(phong,{ ambient:0.5, diffusivity:1, specularity:1, color: color(0.83,0.83,0.83,1) } ),
          road: new Material(bump,{ambient: 0.6, texture: new Texture( "assets/road4.png" )}),
          grass: new Material(bump,{ambient: 0.5, texture: new Texture( "assets/grass.png" )}),
          
          stars: new Material( new defs.Textured_Phong( 1 ),  { color: color( .8,.8,.5,1 ), 
                  ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/ChurchBrick.png" ) }),
          powell: new Material( bump,  { color: color( .8,.8,.5,1 ), 
                  ambient: .3, diffusivity: .3, specularity: .5, texture: new Texture( "assets/ChurchBrick.png" ) }),
          letter: new Material(phong,{ ambient: 1, diffusivity: 1, specularity: 1, color: color( 0.325,0.408,0.584,1 ) } ),

          

        }

        this.coord = [15,3,0];
        this.jump_t = 0;
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
      this.key_triggered_button( "left", [ "1" ], () => {this.left_f = 1 ;this.right_f =0}   , "green",() => {this.left_f =  0;} );
      this.key_triggered_button( "jump", [ "2" ], () => this.up_f = 1     , "green",() => {} );
      this.key_triggered_button( "right", [ "3" ],() => {this.right_f = 1; this.left_f = 0} , "green",() => {this.right_f = 0;});
      this.key_triggered_button( "speed up", [ "9" ],() => {this.bruin_speed += 5;});
      this.key_triggered_button( "speed down", [ "0" ],() => {this.bruin_speed -= 5;});
    }

  calc_height(nc_idx,c_idx,track_idx,x_loc){
    let base_height = 0;
    let height_diff = this.corner[track_idx][nc_idx][1] -this.corner[track_idx][c_idx][1];
    let base_dist = this.corner[0][nc_idx][0] -this.corner[0][c_idx][0]; //calcuate distance of inner track

    if(height_diff != 0){
      let low_plane_idx = (Math.sign(height_diff) == -1) ? nc_idx:c_idx ; //choose lower plane as reference

      base_height = (x_loc-this.corner[0][low_plane_idx][0])/Math.abs(base_dist)* Math.abs(height_diff)+3;
    }else base_height = this.corner[track_idx][nc_idx][1];

    if(base_height>10) base_height =10;
    if(base_height<3) base_height =3;

    return base_height;
  }


  create_obstacle(num_obstacles){
      if(this.obsticle_list.length<num_obstacles){
        let rand = Math.random()
        let r_sign = Math.random()>0.5? -1: 1;
        let locs = [0,3,0];

        let rand_track = Math.floor((Math.random()*this.corner.length)%this.corner.length);
        let rand_corner = Math.floor((Math.random()*this.corner[0].length) %this.corner[0].length);
        let rand_nxcorner = (rand_corner+1)% this.corner[0].length;

        let track_change = Vector.from(this.corner[rand_track][rand_nxcorner]).minus(Vector.from(this.corner[rand_track][rand_corner]));
        track_change = track_change.times(rand); //here is the problem


        if(track_change[2] ===0) {
          locs[2] = this.corner[rand_track][rand_nxcorner][2];
          locs[0] = track_change[0]+this.corner[rand_track][rand_corner][0]
        }
        else {
          locs[0] = this.corner[rand_track][rand_nxcorner][0];
          locs[2] = track_change[2]+this.corner[rand_track][rand_corner][2]
        }

        locs[1] = this.calc_height(rand_nxcorner,rand_corner,rand_track,locs[0]);

        if(this.collision_test(locs) === -1){
          let ob_param = { location: locs,
                            bounding: 2,
                            goodbad: rand>0.5};

          this.obsticle_list.push(ob_param);
        }
      }
    }

    //locations, orientation, ..., bounding box size, good_or_bad


  collision_test(test_point){
      let index = -1;
      for(var i = 0; i< this.obsticle_list.length;i++){
        let rad = this.obsticle_list[i].bounding;
        let inside = this.obsticle_list[i].location.every((n,j)=>Math.abs(n-test_point[j])<rad); //if inside bounding for all
        if(inside && this.obsticle_list[i].goodbad){
          this.score +=1;
          index = i;
        }else if(inside && !this.obsticle_list[i].goodbad){
          this.score -=1;
          index = i;
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
                    this.coord[0] -= speed*dt;
                    theta = Math.PI/2;
                    if ( (this.corner[track_idx][nc_idx][0] - this.coord[0]) >=0 ) this.c_idx = nc_idx;
                    this.coord[2] = this.corner[track_idx][nc_idx][2];
                    break;

      case dir[0] == 1:
                    this.coord[0] += speed*dt;
                    theta = -Math.PI/2;
                    if ( (this.coord[0] -this.corner[track_idx][nc_idx][0]) >=0 ) this.c_idx = nc_idx;
                    this.coord[2] = this.corner[track_idx][nc_idx][2];
                    break;

      case dir[2] == -1:
                    this.coord[2] -= speed*dt;
                    theta = 0;
                    if ((this.corner[track_idx][nc_idx][2] - this.coord[2]) >=0 ) this.c_idx = nc_idx;
                    this.coord[0] = this.corner[track_idx][nc_idx][0];
                    break;

      case dir[2] ==1:
                    this.coord[2] += speed*dt;
                    theta = Math.PI;
                    if ((this.coord[2] -this.corner[track_idx][nc_idx][2]) >=0 ) this.c_idx = nc_idx;
                    this.coord[0] = this.corner[track_idx][nc_idx][0];
                    break;

    }

    //calculate base height on stair

    let base_height = this.calc_height(nc_idx,this.c_idx,track_idx,this.coord[0])


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
        let model = Mat4.identity().times(Mat4.translation(locs[0],locs[1],locs[2])).times(Mat4.rotation(ori,0,1,0));
        //model = model.times(this.attached());
        this.shapes.torus.draw(context,program_state,model,this.materials.test);
        this.shapes.ball.draw(context,program_state,model.times(Mat4.translation(0,0,1)),this.materials.lt_gray );

        return model
    }

  drawObstacle(context, program_state,locs,ori,rad,g_b){
        let model = Mat4.identity().times(Mat4.translation(locs[0],locs[1],locs[2])).times(Mat4.rotation(ori,0,1,0));
        if(g_b){
          this.shapes.ball.draw(context, program_state, model,this.materials.lt_gray);
        }
        else {this.shapes.ball.draw(context, program_state,model,this.materials.swampy); }
    }

  drawRoad(context, program_state,model){

      this.shapes.box.draw(context, program_state, model.times(Mat4.scale(6,1,6)),this.materials.road);
      let road_model = model.times(Mat4.translation(0,0,12))
      return road_model
  }


  display( context, program_state )
    {

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
      this.create_obstacle(10); //create 10 obstacle
      let _this  = this;
      this.obsticle_list.forEach(function(item){
        _this.drawObstacle(context, program_state,item.location,0,item.bounding,item.goodbad);
      });

      //draw main character
      let bruin_mat = this.drawBruin(context, program_state,this.coord,bruin_theta);

      // //collision test and remove collided item
      let collide_idx = this.collision_test(this.coord);
      if(collide_idx !== -1) this.obsticle_list.splice(collide_idx,1);

      //document.querySelector( "#score" ).text("score:" + String(this.score));
      $("#score").text("score:" + String(this.score));

      /*****Ground*****/
      this.shapes.box.draw(context, program_state, Mat4.translation(0,4,0).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,40)), this.materials.test);
      this.shapes.box.draw(context, program_state, Mat4.translation(39,7.05,0).times(Mat4.scale(20,1,40)), this.materials.test);
      this.shapes.box.draw(context, program_state, Mat4.translation(-39.7,0.9,0).times(Mat4.scale(20,1,40)), this.materials.test);

      /******Buildings******/    
      //Letter
      this.shapes.letter_u.draw( context, program_state, Mat4.translation(32,10,-28), this.materials.letter );
//       this.shapes.letter_c.draw( context, program_state, Mat4.translation(32,10,-22), this.materials.letter );


      //MOORE                     
      this.shapes.moore.draw( context, program_state, Mat4.translation(12,10,10).times(Mat4.scale(6,6,12)), this.materials.stars  );
      
      //Math Building
      let mat_math_building = Mat4.translation(12,10,32);
      mat_math_building = mat_math_building.times(Mat4.rotation(1.5 * Math.PI,0,-1,0));
      mat_math_building = mat_math_building.times(Mat4.scale(3,6,15));
      this.shapes.math.draw( context, program_state, mat_math_building, this.materials.stars  );

      //Union
      let mat_union = Mat4.translation(-18,8,12);
//       mat_union = mat_union.times(Mat4.rotation(0.5*Math.PI,-1,0,0));
      mat_union = mat_union.times(Mat4.scale(6,6,6));
      this.shapes.union.draw( context, program_state, mat_union, this.materials.stars  );

      //Powell
      let mat_library = Mat4.translation(7,10,-13).times(Mat4.rotation(Math.PI,0,1,0)).times(Mat4.scale(6,6,6));
      this.shapes.powell.draw( context, program_state, mat_library, this.materials.powell  );

      //Royce
      let mat_royce = Mat4.translation(7,9,-32).times(Mat4.scale(10,6,6));
      this.shapes.royce.draw( context, program_state, mat_royce, this.materials.powell  );

      //Engineering VI & V
      this.shapes.e6.draw( context, program_state, Mat4.translation(-18,6,34).times(Mat4.scale(6,6,6)), this.materials.stars  );
      this.shapes.e5.draw( context, program_state, Mat4.translation(-6,6,34).times(Mat4.scale(6,6,6)), this.materials.stars  );

      //Kaufman
      this.shapes.kaufman.draw( context, program_state, Mat4.translation(-18,6,-12).times(Mat4.scale(6,6,6)), this.materials.stars  );

      //Student activity center
      this.shapes.act.draw( context, program_state, Mat4.translation(-18,4,-32).times(Mat4.scale(6,6,6)), this.materials.stars  );

      
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
