{
  description = "An android development shell for nixos";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };
  outputs = inputs @ {
    flake-parts,
    self,
    ...
  }:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = [
        "x86_64-linux"
      ];
      perSystem = {
        pkgs,
        lib,
        system,
        ...
      }: let
        android_env = pkgs.androidenv.override {licenseAccepted = true;};
        android_composite = android_env.composeAndroidPackages {
          includeNDK = true;
          cmdLineToolsVersion = "8.0";
          cmakeVersions = ["3.10.2"];
          buildToolsVersions = [
            "35.0.0"
            "34.0.0"
          ];
          platformVersions = [
            "34"
            "35"
          ];

          # change if you'd like an emulator
          includeEmulator = false;
          includeSystemImages = false;
        };
        android_sdk = pkgs.android-studio.withSdk android_composite.androidsdk;
      in {
        # Override unfree packages
        _module.args.pkgs = import self.inputs.nixpkgs {
          inherit system;
          config.allowUnfree = true;
          config.android_sdk_accept_license = true;
          config.allowUnfreePredicate = pkg:
            builtins.elem (lib.getName pkgs) [
              "terraform"
            ];
        };
        devShells.default = pkgs.mkShell {
          name = "android-dev";

          buildInputs = with pkgs; [
            jdk
            android_sdk
          ];

          ANDROID_HOME = "${android_composite.androidsdk}/libexec/android-sdk";
          ANDROID_SDK_ROOT = "$ANDROID_HOME";
          ANDROID_NDK_ROOT = "$ANDROID_HOME/ndk-bundle";
          GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${android_composite.androidsdk}/libexec/android-sdk/build-tools/34.0.0/aapt2";

          shellHook = ''
            export PATH=$PATH:$ANDROID_HOME/platform-tools
            echo "done here :)"
            echo "Welcome to the nix-android-shell!"
          '';
        };
      };
    };
}
