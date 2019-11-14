window.Cube_Single_Strip = window.classes.Cube_Single_Strip =
class Cube_Single_Strip extends Shape
  { constructor()
      { super( "positions", "normals" );

        // TODO (Extra credit part I)
        this.positions.push( ...Vec.cast( [-1,-1,-1],[-1,-1,1],[1,-1,1],[1,-1,-1],
                                          [-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]));
        this.normals.push( ...Vec.cast( [-1,-1,-1],[-1,-1,1],[1,-1,1],[1,-1,-1],
                                          [-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]));

        this.indices.push(0,3,1,1,3,2, 5,3,2,2,6,5, 6,2,1,1,7,6, 7,1,0,0,4,7, 4,0,3,3,5,4, 7,4,5,5,6,7 );
      }
  }

window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
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
            ring:     context.get_instance( Ring_Shader  ).material(),
            ice_gray: context.get_instance( Phong_Shader ).material(Color.of(0.745,0.764,0.776,1), {ambient:0, diffusivity:1, specularity:0}),
            swampy:   context.get_instance( Phong_Shader ).material(Color.of(0.01,0.196,0.125,1), {ambient:0, diffusivity:0.4, specularity:1}),
            muddy:    context.get_instance( Phong_Shader ).material(Color.of(0.65,0.37,0.18,1), {ambient:0.5, diffusivity:1, specularity:1}),
            lt_blue:  context.get_instance( Phong_Shader ).material(Color.of(0.15,0,0.69,1), {ambient:0, diffusivity:1, specularity:0.8}),
            lt_gray:  context.get_instance( Phong_Shader ).material(Color.of(0.83,0.83,0.83,1), {ambient:0.5, diffusivity:1, specularity:1}),


          }

        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
        this.move_dir = '+x';
        this.last_xcoord = 0;
        this.last_zcoord = 0;
        this.attached = () => Mat4.identity();
        this.moveleft = Mat4.translation([-2,0,0]);
        this.moveright = Mat4.translation([2,0,0]);
        this.moveup = Mat4.translation([0,2,0]);
        this.map= []
      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { //this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.key_triggered_button( "left", [ "1" ], () => this.attached = () => this.moveleft , null,() => this.attached = () => Mat4.identity() );
        this.key_triggered_button( "jump", [ "2" ], () => this.attached = () => this.moveup ,   null,() => this.attached = () => Mat4.identity() );
        this.key_triggered_button( "right", [ "3" ],() => this.attached = () => this.moveright, null,() => this.attached = () => Mat4.identity());

      }

    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        graphics_state.lights =  [new Light( Vec.of( 0,50,0,1 ), Color.of( 0,0,0,1),1000) ];
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;




        //ground
        this.shapes.box.draw(graphics_state, Mat4.scale([20,1,20]), this.materials.test);
        this.shapes.box.draw(graphics_state, Mat4.translation([0,1,15]).times(Mat4.scale([16,1,1])),this.materials.muddy);
        this.shapes.box.draw(graphics_state, Mat4.translation([0,1,-15]).times(Mat4.scale([16,1,1])),this.materials.muddy);
        this.shapes.box.draw(graphics_state, Mat4.translation([15,1,0]).times(Mat4.scale([1,1,16])),this.materials.muddy);
        this.shapes.box.draw(graphics_state, Mat4.translation([-15,1,-0]).times(Mat4.scale([1,1,16])),this.materials.muddy);

        let human_transform  = Mat4.identity();


        //let move_dirs = ['+x','-x','+z','-z'];


        switch(this.move_dir){
          case '+x':this.last_xcoord+= dt*10;
                    if(this.last_xcoord>=15) this.move_dir = '+z';
                    this.camera_rotation = Mat4.rotation(Math.PI/2,Vec.of(0,-1,0));
                    break;

          case '-x':this.last_xcoord-= dt*10;
                    if(this.last_xcoord<=-15) this.move_dir = '-z';
                    this.camera_rotation = Mat4.rotation(Math.PI/2,Vec.of(0,1,0));
                    break;

          case '+z':this.last_zcoord+= dt*10;
                    if(this.last_zcoord>=15) this.move_dir = '-x';
                    this.camera_rotation = Mat4.rotation(Math.PI,Vec.of(0,1,0));
                    break;

          case '-z':this.last_zcoord-= dt*10;
                    if(this.last_zcoord<= -15) this.move_dir = '+x';
                    this.camera_rotation = Mat4.identity();
                    break;
        }

        human_transform = human_transform.times(Mat4.translation([ this.last_xcoord ,3,this.last_zcoord])).times(this.camera_rotation).times(this.attached());

        this.shapes.torus2.draw(graphics_state,human_transform,this.materials.lt_gray);
        this.shapes.ball.draw(graphics_state,human_transform.times(Mat4.translation([0,0,1])),this.materials.lt_gray  )
        /*****camera control*****/
        let desired = human_transform.times(Mat4.translation([0,5 ,4])).times(Mat4.rotation(-Math.PI/6,Vec.of(1,0,0)));
        desired = Mat4.inverse(desired);
        desired = desired.map( (x,i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, 0.05 ) )
        graphics_state.camera_transform = desired;

      }
  }


// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function,
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused.
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        {
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        void main()
        {
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );

      } }
