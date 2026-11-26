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
        versionCode = 364
        versionName = "3.64"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            storeFile = file("qiraati-release.keystore")
            storePassword = System.getenv("QIRAATI_KEYSTORE_PASSWORD") ?: ""
            keyAlias = System.getenv("QIRAATI_KEY_ALIAS") ?: "qiraati"
            keyPassword = System.getenv("QIRAATI_KEY_PASSWORD") ?: System.getenv("QIRAATI_KEYSTORE_PASSWORD") ?: ""
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
        noCompress += listOf("mp3", "wav", "ogg", "png", "jpg", "jpeg", "webp", "woff2", "js", "css", "html", "json")
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.10.0")
}
