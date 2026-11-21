plugins {
    id("com.android.application")
}

android {
    namespace = "iq.usama.qiraati"
    compileSdk = 34

    defaultConfig {
        applicationId = "iq.usama.qiraati"
        minSdk = 24
        targetSdk = 34
        versionCode = 338
        versionName = "3.38"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            storeFile = file("qiraati-release.keystore")
            storePassword = "qiraati_smart_2026"
            keyAlias = "qiraati"
            keyPassword = "qiraati_smart_2026"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            signingConfig = signingConfigs.getByName("release")
        }
    }

    androidResources {
        noCompress += listOf("mp3", "wav", "ogg", "png", "jpg", "jpeg", "webp", "js", "css", "html", "json")
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.10.0")
}
