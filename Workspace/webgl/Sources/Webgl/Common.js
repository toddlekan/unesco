﻿
var UG = {};
var PX = {};



// Precision timer
//
var timeNow;
if (this.performance && performance.now) 
{
    timeNow = function () 
    {
        return performance.now() * 0.001;
    };
}
else 
{
    timeNow = function () 
    {
        return Date.now() * 0.001;
    };
}


// PX Commons stuff
//
PX =
{
    // Resources
    AssetsDatabase: []


    // Globals
    , IsMobile: true


    // Paths
    , ModelRootPath: "webgl/data/models/"
    , ModelPaths: 
    [
          "01_Nimrud_Relief/"
        , "02_Ceiling_in_the_Temple_of_Bel/"
        , "03_Stela_7/"
        , ""
        , "05_Hatra_Relief/"
        , "06_Mihrab_of_the_mosque_al_Hasan/"
        , "07_Sculpture_from_Hatra/"
        , ""
        , "09_Durbar_Square_Kathmandu_Nepal/"
        , "10_The_Box_of Yahya_bin_Al-Kassim_Tomb_in_Mosul/"
        , "11_Statue_Lying_on_Floor_in_Mosul/"
        , "12_Hatrene_Priest/"
        , "13_Lamassus_Right/"
        , ""
        , "15_Nimrud_Wall_Frieze/"
        , "16_Lion_of_Mosul/"
        , "17_Reclining_Woman_Relief_(Mosul)/"
        , "18_Lion_of_Al/"
        , "19_Segment_of_Elahbel_Tower_Tomb_Interior/"
        , "20_Incense_Table_God_Nirgul_Relif/"
    ]
    , ModelNames: 
    [
          "01_Nimrud_Relief2"
        , "02_Ceiling_Temple_Bel2"
        , "03_Stela_7_LOW_2"
        , ""
        , "05_Hatra_relief3"
        , "06_Mihrab_of_the_Mosque_Al_Hasan2"
        , "07_Sculpture_from_Hatra2"
        , ""
        , "09_Durbar_Square_Kathmandu_Nepal"
        , "10_The_Box_of Yahya_bin_Al-Kassim_Tomb_in_Mosul"
        , "11_Statue_Lying_on_Floor_in_Mosul"
        , "12_Hatrene_Priest"
        , "13_Lamassus_Right"
        , ""
        , "15_Nimrud_Wall_Frieze"
        , "16_lion3"
        , "17_Reclining_Woman_Relief_(Mosul)3"
        , "18_Lion_of_Al"
        , "19_Segment_of_Elahbel_Tower_Tomb_Interior"
        , "20_Incense_Table_God_Nirgul_Relif"
    ]


    // Constants
    , EPSILON: 0.0001

    //, ShaderPrecision: "mediump"
    , ShaderPrecision: "highp"

    , StartLatLon: { x: 6.3377571, y: 43.139408 }

    , kEnableGUI: false
    , kEnableStats: false
    , kTimeOut: true

    , ModelTypeDestroyed: 0
    , ModelTypeUnderConstruction: 1
    , ModelTypeReconstructed: 2

    , MinDistancesPerLevel: [ 230, 80 ]

    , kEarthScale: 30.0
    , kEarthDetailX: 32 * 2
    , kEarthDetailY: 22 * 2
    , kMarkerOffsetFromEarthSurface: 0.0
    , kLocationMarkerScale: 0.6
    , kLocationMarkerDetail: 24 //16
    , kLocationMarkerZScale: 0.2 //0.125
    , kLocationFontSize: 9  // Level 0 font size
    , kLocationNameTagFontSize: 8  // Nametag font size
    , kAvoidanceSpeed: 0.031
    , kMaxGridSize: 4
    //, kLocationTextSize: 120.0
    , kLocationColor: new THREE.Color( 0x171c5e )   // Default color
    , kLocationMouseOverColorLevel0: new THREE.Color( 0xa3d5fe )   // Mouse over color Level 0
    , kLocationMouseOverColorLevel1: new THREE.Color( 0xf0fbff )   // Mouse over color Level 1
    /*, kLocationColors2: [ 
        new THREE.Color( 0xff0000 ),    // Destroyed
        new THREE.Color( 0xffff00 ),    // Under Construction
        new THREE.Color( 0x00ff00 ) ]   // Reconstructed*/
    , kLocationColors2: [ 
        new THREE.Color( 0x767789 ),    // Destroyed
        new THREE.Color( 0x273d90 ),    // Under Construction
        new THREE.Color( 0x61b2ff ) ]   // Reconstructed

    , kCameraFovY: 36.0
    , kCameraNearPlane: 16.0
    , kCameraFarPlane: 200.0
    , kModelCameraNearPlane: 0.1
    , kModelCameraFarPlane: 1000.0

    // IMPORTANT!!
    // If these change, also change the 2 below
    , kCameraMinDistance: 70.0
    , kCameraMaxDistance: 160.0
    , kCameraOneOverMinDistance: 1.0 / 70.0     
    , kCameraOneOverMaxDistance: 1.0 / 160.0

    , kZoomMaxLevel: 3.0

    , XAxis: new THREE.Vector3(1, 0, 0)
    , YAxis: new THREE.Vector3(0, 1, 0)
    , ZAxis: new THREE.Vector3(0, 0, 1)
    , XAxisNeg: new THREE.Vector3(-1, 0, 0)
    , YAxisNeg: new THREE.Vector3(0, -1, 0)
    , ZAxisNeg: new THREE.Vector3(0, 0, -1)    
    , ZeroVector: new THREE.Vector3(0, 0, 0)
    , IdentityQuat: new THREE.Quaternion()

    , RAD_TO_DEG: (180.0 / Math.PI)
    , DEG_TO_RAD: (Math.PI / 180.0)

    , ToDegrees: function( x )
    {
        return x * PX.RAD_TO_DEG;
    }

    , ToRadians: function( x )
    {
        return x * PX.DEG_TO_RAD;
    }

    , Lerp: function( a, b, t )
    {
        //return b*t + (a - t*a);
        return (a + t*(b - a) );
    }

	, Step: function( x, t )
	{	
		return ( x >= t ) ? 1.0 : 0.0;
	}        

    , Pulse: function( a, b, x )
    {
		return PX.Step( a, x ) - PX.Step( b, x );
    }

    , CubicPulse: function( c, w, x )
    {
        x = Math.abs(x - c);
        if( x > w ) return 0.0;
        x /= w;
        return 1.0 - x * x * ( 3.0 - 2.0 * x );
    }

    , Saturate: function( x )
    {
        if( x < 0.0 ) return 0.0;
        if( x > 1.0 ) return 1.0;
        return x;
    }

    , Clamp: function( x, a, b )
    {
        return Math.max( a, Math.min( x, b ) );
    }

    , ClampVector3: function( res, a, b )
    {
        res.x = PX.Clamp( res.x, a, b );
        res.y = PX.Clamp( res.y, a, b );
        res.z = PX.Clamp( res.z, a, b );
    }

    , LerpVector3: function( res, a, b, t )
    {
        res.x = PX.Lerp( a.x, b.x, t );
        res.y = PX.Lerp( a.y, b.y, t );
        res.z = PX.Lerp( a.z, b.z, t );
    }

    , TweenCubic: function( t )
    {
        return t*t*t;
    }

    , Smoothstep: function( edge0, edge1, x )
    {
        // Scale, bias and saturate x to 0..1 range
        x = PX.Saturate( (x - edge0) / (edge1 - edge0) );
        // Evaluate polynomial
        return x*x*(3 - 2*x);
    }

    , Pow2: function( x )
    {
        return ( x * x );
    }

    , Pow3: function( x )
    {
        return ( x * x * x );
    }

    , Pow4: function( x )
    {
        var x2 = x * x;
        return ( x2 * x2 );
    }

};


var WebpageStates =
{
    FilterSwitches: []
    , CurrentActiveFilterIndex: -1
    , IsFirstTimeRun: true  // Allow a set default run one time only
};


var Params =
{
    Latitude: 38.7223
    , Longitude: 9.1393
    , WindowWidth: 0
    , WindowHeight: 0
    , MainScene: true
    , ShowMaps: false
    , ShowStats: true
    , EnableSunLight: false
    , EnableBloom: true
    //, BloomOpacity: 0.5
    , BloomOpacity: 1.0
    , CameraDistance: PX.kCameraMaxDistance
    , Level0MarkerRadius: 30.0
    , AnimTime: 1.0
    , Art_CameraDistance: 100.0
    , CameraNearPlane: PX.kCameraNearPlane
    // Model
    , ModelAmbientIntensity: 0.001
    , ModelDiffuseIntensity: 3.14
    , ModelSpecularIntensity: 0.1
    , ModelRoughness: 0.7
    // Globe
    , AmbientIntensity: 0.00033
    , DiffuseIntensity: 0.5 //1.5 //1.125
    , SpecularIntensity: 0.07
    , NormalMapIntensity: 0.6
    , CloudsIntensity: 0.0 //0.1
    , CloudsShadowIntensity: 0.0 //0.3
    , CloudsShadowOffset: 0.0 //5.0
    , NightDayMixFactor: 0.5 // 0.25
    , EarthRoughness: 0.8
    , EarthRotationSpeed: 0.5
    , HalfLambertPower: 2.0
    , RimAngle: 0.4
    , DiffuseRimIntensity: 0.25
    , LightDirX: 0.5
    , LightDirY: 1.0
    , LightDirZ: -0.2
    , MapGridSize: PX.kMaxGridSize
    , Latitude: 0.0
    , Longitude: 0.0
    , ZoomLevel: 0.0
    , TiltShiftStrength: 0.0
    , TiltShiftMaxStrength: 2.0
    , TiltShiftPosition: 0.5
    , Intersects: 0
    , Dummy: 0.5
    , OutlineThickness: 50.0 * 3.0

    , OutlineDist: 0.0
    , MarkerCircleDist: -PX.kLocationMarkerScale * 0.25 // negative means move away from the center
    , MarkerTextDist: -PX.kLocationMarkerScale * 0.15   //

    , EarthShadowScaleX: 170.0 //PX.kEarthScale * 4.0
    , EarthShadowScaleY: 100.0 //PX.kEarthScale * 2.0
    , EarthShadowScaleZ: 0.0
    , EarthShadowPosX: 2.0
    , EarthShadowPosY: -40.0 //-PX.kEarthScale * 1.5
    , EarthShadowPosZ: 0.0

};
