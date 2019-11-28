import {tiny, defs} from './common.js';

                                                  // Pull these names into this module's scope for convenience:
const { Vector,vec3, vec4, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;
const { Torus,Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere } = defs;

export class Transforms_Sandbox_Base extends Scene
{
  constructor()
    {                  // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
      super();

      this.shapes = { "torus":  new Torus(15,15),
                       "box": new Cube(),
                       "ball": new Subdivision_Sphere(4),

                     }

      const phong = new defs.Phong_Shader();


      this.materials =
        { test:     new Material(phong,{ ambient: .2, diffusivity: 1, specularity: 0, color: color( 1,1,0,1 ) } ),

          ring:     new Material(phong),
          ice_gray: new Material(phong,{ ambient: .2, diffusivity: 1, specularity: 0, color: color(0.745,0.764,0.776,1) } ),

          swampy:   new Material(phong,{ ambient:0.2, diffusivity:0.4, specularity:1, color: color(0.01,0.196,0.125,1) } ),

          muddy:    new Material(phong,{ ambient:0.5, diffusivity:1, specularity:1, color: color(0.65,0.37,0.18,1) } ),

          lt_blue:  new Material(phong,{ ambient:0, diffusivity:1, specularity:0.8, color: color(0.15,0,0.69,1) } ),

          lt_gray:new Material(phong,{ ambient:0.5, diffusivity:1, specularity:1, color: color(0.83,0.83,0.83,1) } ),



        }

        this.coord = [15,3,0];
        this.jump_t = 0;
        this.c_idx = 0; //last corner index
        // this.corner= [[[13,0,13],[13,0,-13],[-13,0,-13],[-13,0,13]],
        //               [[15,0,15],[15,0,-15],[-15,0,-15],[-15,0,15]],
        //               [[17,0,17],[17,0,-17],[-17,0,-17],[-17,0,17]]];

        this.corner= [[[23,10,23],[23,10,-23],[-23,3,-23],[-23,3,23]],
                      [[25,10,25],[25,10,-25],[-25,3,-25],[-25,3,25]],
                      [[27,10,27],[27,10,-27],[-27,3,-27],[-27,3,27]]];

        this.obsticle_list = [] //store all collision obsticle_list item.
        this.score = 0
    }
  make_control_panel()
    {
      this.key_triggered_button( "left", [ "1" ], () => {this.left_f = 1 ;this.right_f =0}   , null,() => {this.left_f =  0;} );
      this.key_triggered_button( "jump", [ "2" ], () => this.up_f = 1     , null,() => {} );
      this.key_triggered_button( "right", [ "3" ],() => {this.right_f = 1; this.left_f = 0} , null,() => {this.right_f = 0;});
    }


  create_obstacle(){
      if(this.obsticle_list.length<5){
        let rand = Math.random()
        let r_sign = Math.random()>0.5? -1: 1;
        let locs = [0,3,0];

        let rand_track = Math.floor((Math.random()*this.corner.length)%this.corner.length);
        let rand_corner = Math.floor((Math.random()*this.corner[0].length) %this.corner[0].length);
        let rand_nxcorner = (rand_corner+1)% this.corner[0].length;

        let track_change = Vector.from(this.corner[rand_track][rand_nxcorner]).minus(Vector.from(this.corner[rand_track][rand_corner]));
        track_change = track_change.times(rand).times(r_sign).times(0.5);
        if(track_change[2] ===0) {
          locs[2] = this.corner[rand_track][rand_nxcorner][2];
          locs[0] = track_change[0]
        }
        else {
          locs[0] = this.corner[rand_track][rand_nxcorner][0];
          locs[2] = track_change[2]
        }

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
    let base_height = 0;
    let height_diff = this.corner[track_idx][nc_idx][1] -this.corner[track_idx][this.c_idx][1];
    let base_dist = this.corner[0][nc_idx][0] -this.corner[0][this.c_idx][0]; //calcuate distance of inner track

    if(height_diff != 0){
      let low_plane_idx = (Math.sign(height_diff) == -1) ? nc_idx:this.c_idx ; //choose lower plane as reference

      base_height = (this.coord[0]-this.corner[0][low_plane_idx][0])/Math.abs(base_dist)* Math.abs(height_diff)+3;
    }else base_height = this.corner[track_idx][nc_idx][1];

    if(base_height>10) base_height =10;
    if(base_height<3) base_height =3;

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
    console.log(base_height);


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


  display( context, program_state )
    {

                           // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
      if( !context.scratchpad.controls )
        { this.children.push( context.scratchpad.controls = new defs.Movement_Controls() );
          program_state.set_camera( Mat4.translation( 0,-10,-80 ).times(Mat4.rotation(Math.PI/4,1,0,0)) );
        }

      program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 500 );
      const t = this.t = program_state.animation_time/1000,dt = program_state.animation_delta_time / 1000;
      program_state.lights = [new Light( Vector.of( 0,50,0,1 ), color( 1,1,1,1),1000) ];



      //update location and return orientation of bruin
      let bruin_theta = this.bruin_control(dt);
      this.create_obstacle();
      //
      // /*****draw all obstacles*******/
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




      //ground
      this.shapes.box.draw(context, program_state, Mat4.translation(0,4,0).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,40)), this.materials.test);
      this.shapes.box.draw(context, program_state, Mat4.translation(39,7.05,0).times(Mat4.scale(20,1,40)), this.materials.test);
      this.shapes.box.draw(context, program_state, Mat4.translation(-39.7,0.9,0).times(Mat4.scale(20,1,40)), this.materials.test);

      //road
      this.shapes.box.draw(context, program_state, Mat4.translation(0,4.5,25).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,3)),this.materials.muddy);
      this.shapes.box.draw(context, program_state, Mat4.translation(0,4.5,-25).times(Mat4.rotation(Math.PI/20,0,0,1)).times(Mat4.scale(20,1,3)),this.materials.muddy);
      this.shapes.box.draw(context, program_state, Mat4.translation(25,7.5,0).times(Mat4.scale(6,1,28)),this.materials.muddy);
      this.shapes.box.draw(context, program_state, Mat4.translation(-25,1.5,-0).times(Mat4.scale(6,1,28)),this.materials.muddy);

      //camera matrix
      let camera_model = bruin_mat.times(Mat4.translation(0,5,5)).times(Mat4.rotation(-Math.PI/6,1,0,0));
      camera_model = Mat4.inverse(camera_model);
      camera_model = camera_model.map( (x,i) => Vector.from( program_state.camera_inverse[i] ).mix( x, 0.05 ) )
      program_state.set_camera(camera_model);

    }
}
