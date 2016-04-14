


//
var Location = function()
{ 
    this.GUID = "";
    this.name = null;       // Location name
    this.latlon = null;     // Lat/long
    this.position = null;   // 3D position in sphere
};
Location.prototype =
{
    constructor: Location
}


//
UG.LocationMarker = function()
{ 
    this.GUID = "";
    this.text = "";
    this.latlon = new THREE.Vector2();
    this.position = new THREE.Vector3();
    this.markerCount = 0;
};
UG.LocationMarker.prototype =
{
    constructor: UG.LocationMarker
}



//
UG.Earth = function ()
{
    this.mesh = null;
    this.geometry = null;
    this.materialAttributes = null;
    this.material = null;
    this.uniforms = null;

    this.worldMatrix = new THREE.Matrix4();

    this.doIntroAnimation = true;
    this.introScale = { x: 0.001 };
};


UG.Earth.prototype =
{
    constructor: UG.Earth

    , Init: function( scene )
    {
        this.uniforms =
        {
            DiffuseMap: { type: "t", value: PX.AssetsDatabase["EarthDiffuseMap"] }
            , NormalMap: { type: "t", value: PX.AssetsDatabase["EarthNormalMap"] }
            , SpecularMap: { type: "t", value: PX.AssetsDatabase["EarthSpecularMap"] }
            , CloudsMap: { type: "t", value: PX.AssetsDatabase["EarthCloudsMap"] }
            //, CloudsNormalMap: { type: "t", value: PX.AssetsDatabase["EarthCloudsNormalMap"] }
            , NightLightsMap: { type: "t", value: PX.AssetsDatabase["EarthNightLightsMap"] }
            , World: { type: "m4", value: this.worldMatrix }
            , ViewPosition: { type: "v3", value: null }
            , LightDirection: { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
            , Params0: { type: "v4", value: new THREE.Vector4() }
            , Params1: { type: "v4", value: new THREE.Vector4() }
            , Params2: { type: "v4", value: new THREE.Vector4() }
            , Time: { type: "f", value: 0.0 }
        }

        this.materialAttributes =
        {
            ParticleColorAndIndex:
            {
                type: 'f'
                , value: null
            }
            , ParticleOffsetDirectionVector:
            {
                type: 'f'
                , value: null
            }
            , ParticleScale:
            {
                type: 'f'
                , value: null
            }
        };

        this.material = new THREE.ShaderMaterial(
        {
            uniforms: this.uniforms
            //, attributes: this.materialAttributes
            , vertexShader: PX.AssetsDatabase["EarthVertexShader"]
            , fragmentShader: PX.AssetsDatabase["EarthPixelShader"]
            , vertexColors: THREE.VertexColors
        } );
        //this.material.side = THREE.DoubleSide;
        this.material.extensions.derivatives = true;
        //this.material.transparent = true;

        this.mesh = new THREE.Mesh( new THREE.SphereGeometry( PX.kEarthScale, PX.kEarthDetail, PX.kEarthDetail), this.material );
        this.mesh.position.set( 0, 0, 0 );
        //this.mesh.scale = new THREE.Vector3( 1.0, 1.0, 1.0 );

        scene.add( this.mesh );


        // Add intro tween
        //
        var target = { x : 1.0 };
        var tween = new TWEEN.Tween( this.introScale ).to( target, 2000 );
        tween.easing( TWEEN.Easing.Sinusoidal.InOut );
        tween.delay( 2000 );
        tween.start();
        tween.onComplete( function()
        {
            appStateMan.SetState( PX.AppStates.AppStateEntry );
        });
    }

    , Update: function( time, frameTime, camera )
    {
        // Update globe's scale
        //
        this.mesh.scale.set( this.introScale.x, this.introScale.x, this.introScale.x );


        // Update shader params
        //
        this.uniforms.Time.value = time;
        this.uniforms.Params0.value.set( Params.AmbientIntensity, Params.DiffuseIntensity, Params.SpecularIntensity, Params.NormalMapIntensity );
        this.uniforms.Params1.value.set( Params.CloudsIntensity, Params.CloudsShadowIntensity, Params.CloudsShadowOffset, Params.NightDayMixFactor );
        this.uniforms.Params2.value.set( Params.EarthRoughness, Params.HalfLambertPower, Params.RimAngle, Params.DiffuseRimIntensity );
        this.uniforms.ViewPosition.value = camera.position;
        this.uniforms.LightDirection.value.set( -Params.LightDirX, -Params.LightDirY, -Params.LightDirZ );


        // While in Entry point, globe is slowly rotating
        if( appStateMan.IsState( PX.AppStates.AppStateEntry ) )
        {
            var quaty = new THREE.Quaternion();
            quaty.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), PX.ToRadians( time * 6.0 ) );
            this.mesh.quaternion.copy( quaty );
        }

        //
        this.worldMatrix.makeRotationFromQuaternion( this.mesh.quaternion );
    }


    , ResetTransform: function( onCompleteCB )
    {
        var scope = this;

        var dest = new THREE.Quaternion();
        dest.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), PX.ToRadians( -0.0 ) );
        var tween = new TWEEN.Tween( this.mesh.quaternion ).to( dest, 2000 );
        tween.easing( TWEEN.Easing.Sinusoidal.InOut );
        //tween.delay( 1000 );
        tween.start();
        tween.onComplete( function()
        {
            if( onCompleteCB ) onCompleteCB();
        });
    }

};