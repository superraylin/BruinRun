

window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,30,50 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),
                         box: new Cube_Single_Strip(),
                         ball: new Subdivision_Sphere(4),

                       }
        this.submit_shapes( context, shapes );

                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            ring:     context.get_instance( Phong_Shader  ).material(),
            ice_gray: context.get_instance( Phong_Shader ).material(Color.of(0.745,0.764,0.776,1), {ambient:0, diffusivity:1, specularity:0}),
            swampy:   context.get_instance( Phong_Shader ).material(Color.of(0.01,0.196,0.125,1), {ambient:0.2, diffusivity:0.4, specularity:1}),
            muddy:    context.get_instance( Phong_Shader ).material(Color.of(0.65,0.37,0.18,1), {ambient:0.5, diffusivity:1, specularity:1}),
            lt_blue:  context.get_instance( Phong_Shader ).material(Color.of(0.15,0,0.69,1), {ambient:0, diffusivity:1, specularity:0.8}),
            lt_gray:  context.get_instance( Phong_Shader ).material(Color.of(0.83,0.83,0.83,1), {ambient:0.5, diffusivity:1, specularity:1}),


          }
        //this.bruin = new BruinWalk_Object([0,0,0],"+z",context);
        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
        this.coord = [15,3,0];
        this.jump_t = 0;
        this.jp_finish = 0;

        this.flag_up =0; //indicate if
        this.c_idx = 0; //last corner index


        this.corner= [[[13,0,13],[13,0,-13],[-13,0,-13],[-13,0,13]],
                      [[15,0,15],[15,0,-15],[-15,0,-15],[-15,0,15]],
                      [[17,0,17],[17,0,-17],[-17,0,-17],[-17,0,17]]];

        this.obsticle_list = [] //store all collision obsticle_list item.
        this.score = 0
      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { //this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.key_triggered_button( "left", [ "1" ], () => {this.left_f = 1 ;this.right_f =0}   , null,() => {this.left_f =  0;} );
        this.key_triggered_button( "jump", [ "2" ], () => this.up_f = 1     , null,() => {} );
        this.key_triggered_button( "right", [ "3" ],() => {this.right_f = 1; this.left_f = 0} , null,() => {this.right_f = 0;});
      }

    bruin(locs,ori,graphics_state){
        let model = Mat4.identity().times(Mat4.translation([locs[0],locs[1],locs[2]])).times(Mat4.rotation(ori,Vec.of(0,1,0)));
        //model = model.times(this.attached());
        this.shapes.torus2.draw(graphics_state,model,this.materials.test);
        this.shapes.ball.draw(graphics_state,model.times(Mat4.translation([0,0,1])),this.materials.lt_gray  )
    }

    //locations, orientation, ..., bounding box size, good_or_bad
    obstacle(locs,ori,graphics_state,rad,g_b){
        let model = Mat4.identity().times(Mat4.translation([locs[0],locs[1],locs[2]])).times(Mat4.rotation(ori,Vec.of(0,1,0)));
        if(g_b){
          this.shapes.ball.draw(graphics_state,model,this.materials.lt_gray);}
        else {this.shapes.ball.draw(graphics_state,model,this.materials.swampy); }
    }

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


    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        graphics_state.lights =  [new Light( Vec.of( 0,50,0,1 ), Color.of( 0,0,0,1),1000) ];
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;


        /**********User Input control********/
        let track_idx = 1;
        //select track base on input
        if(this.left_f){
          track_idx = 0;
        }else if(this.right_f){
          track_idx = 2;
        }

        //jump button and position
        let height = 3;
        if(this.up_f){
           height = 3+ 10 * this.jump_t *2 - 4*9.8/2*this.jump_t*this.jump_t; //x = x + vt + 1/2at^2
           this.jump_t += dt;
        }
        if(height<3){
          this.jump_t = 0;
          this.up_f = 0;
          height = 3;
        }
        this.coord[1] =height;


        //change coord base on direction
        let nc_idx = (this.c_idx+1)% this.corner[0].length; //next corner index
        let dir = this.corner[track_idx][nc_idx].map((n,i)=> Math.sign(n- this.corner[track_idx][this.c_idx][i]));
        let theta = 0; //orientation


        switch(dir.join(' ')){
          case '-1 0 0':this.coord[0] -= 10*dt;
                        theta = Math.PI/2;
                        if ( (this.corner[track_idx][nc_idx][0] - this.coord[0]) >=0 ) this.c_idx = nc_idx;
                        this.coord[2] = this.corner[track_idx][nc_idx][2];
                        break;

          case '1 0 0': this.coord[0] += 10*dt;
                        theta = -Math.PI/2;
                        if ( (this.coord[0] -this.corner[track_idx][nc_idx][0]) >=0 ) this.c_idx = nc_idx;
                        this.coord[2] = this.corner[track_idx][nc_idx][2];
                        break;

          case '0 0 -1':this.coord[2] -= 10*dt;
                        theta = 0;
                        if ((this.corner[track_idx][nc_idx][2] - this.coord[2]) >=0 ) this.c_idx = nc_idx;
                        this.coord[0] = this.corner[track_idx][nc_idx][0];
                        break;

          case '0 0 1': this.coord[2] += 10*dt;
                        theta = Math.PI;
                        if ((this.coord[2] -this.corner[track_idx][nc_idx][2]) >=0 ) this.c_idx = nc_idx;
                        this.coord[0] = this.corner[track_idx][nc_idx][0];
                        break;
        }





        //create obsticle param list
        if(this.obsticle_list.length<5){
          let rand = Math.random()
          let r_sign = Math.random()>0.5? -1: 1;
          let locs = [0,3,0];

          let rand_track = Math.floor((Math.random()*this.corner.length)%this.corner.length);
          let rand_corner = Math.floor((Math.random()*this.corner[0].length) %this.corner[0].length);
          let rand_nxcorner = (rand_corner+1)% this.corner[0].length;
          //console.log(rand_track,rand_corner,rand_nxcorner)
          let track_change = Vec.from(this.corner[rand_track][rand_nxcorner]).minus(Vec.from(this.corner[rand_track][rand_corner]));
          track_change = track_change.times(rand).times(r_sign).times(0.5);
          if(track_change[2] ===0) {
            locs[2] = this.corner[rand_track][rand_nxcorner][2];
            locs[0] = track_change[0]
          }
          else {
            locs[0] = this.corner[rand_track][rand_nxcorner][0];
            locs[2] = track_change[2]
          }


          // if(Math.random()>0.5){
          //   locs = [r_sign*rand*15,3,15 *(Math.random()>0.5? -1: 1)]
          // }else{
          //   locs = [15*(Math.random()>0.5? -1: 1),3,15*rand*r_sign]
          // };
          // check if new obsiticle collide with old one
          if(this.collision_test(locs) === -1){
            let ob_param = { location: locs,
                              bounding: 2,
                              goodbad: rand>0.5};

            this.obsticle_list.push(ob_param);
          }
        }

        /*****draw all compoent*******/
        let _this  = this;
        this.obsticle_list.forEach(function(item){
          _this.obstacle(item.location,0,graphics_state,item.bounding,item.goodbad);
        });

        //draw main character
        this.bruin(this.coord,theta,graphics_state);



        //collision test and remove collided item
        let collide_idx = this.collision_test(this.coord);
        if(collide_idx !== -1) this.obsticle_list.splice(collide_idx,1);

        $("#score").text("score:" + String(this.score));


        //ground
        this.shapes.box.draw(graphics_state, Mat4.scale([20,1,20]), this.materials.test);
        this.shapes.box.draw(graphics_state, Mat4.translation([0,1,15]).times(Mat4.scale([16,1,1])),this.materials.muddy);
        this.shapes.box.draw(graphics_state, Mat4.translation([0,1,-15]).times(Mat4.scale([16,1,1])),this.materials.muddy);
        this.shapes.box.draw(graphics_state, Mat4.translation([15,1,0]).times(Mat4.scale([1,1,16])),this.materials.muddy);
        this.shapes.box.draw(graphics_state, Mat4.translation([-15,1,-0]).times(Mat4.scale([1,1,16])),this.materials.muddy);


        // /*****camera control*****/
        // let desired = human_transform.times(Mat4.translation([0,5 ,4])).times(Mat4.rotation(-Math.PI/6,Vec.of(1,0,0)));
        // desired = Mat4.inverse(desired);
        // desired = desired.map( (x,i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, 0.05 ) )
        // graphics_state.camera_transform = desired;

      }
  }
