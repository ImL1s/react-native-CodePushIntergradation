# React Native CodePush集成
author: ImL1s

email: ImL1s@outlook.com

github: [專案]()


## 參考
- [簡書:熱更新CodePush](https://www.evernote.com/shard/s704/sh/ed6ea941-bc49-48e5-967a-8b0c58aa1e6d/83d58f0393515178cf19f2d1db43eefa)
- [Xcode 應用程式構建階段（Build Phases）分析](https://www.evernote.com/shard/s704/sh/bef1c263-bcc8-48b4-bef5-0f8ebc8727f3/d404419896dec7d7814271821b9a490d)
- [Xcode如何设置在编译前自动运行脚本](https://www.evernote.com/shard/s704/sh/7689db80-9408-4dba-a32c-3e120abe5f0f/aaf1d3b87dd4d7e7af44577e32f92a55)
- [React Native用CodePush实现热更新(一) - CSDN博客](https://www.evernote.com/shard/s704/sh/d2a477f5-a209-475e-8ea4-308661b33b86/ee42194e5d247f27507d373ed7fc13ed)
- [React Native用CodePush实现热更新(二) - CSDN博客](https://www.evernote.com/shard/s704/sh/485dfcd8-4a3a-4f6e-9a75-9336b2338755/ea07c9300481d53834d9cd1cd141849f)
- [官方 Github-React Native iOS Setup](https://www.evernote.com/shard/s704/sh/d880ab23-6f9c-4558-89ea-945281085964/431dfc643bda1940a393b5212a82a98b)

## 版本
- react-native-cli: 2.0.1
- react-native: 0.53.0
- code-push: 2.1.6

## 前置作業
### 註冊CodePush
1. 安裝CodePush CLI

		> npm install -g code-push-cli
		> code-push -v
		2.1.6 // 有顯示版本號代表安裝成功

2. 向CodePush註冊App

		> code-push app add CodePushIntergradation ios react-native
		┌────────────┬──────────────────────────────────────────────────────────────────┐
		│ Name       │ Deployment Key                                                   │
		├────────────┼──────────────────────────────────────────────────────────────────┤
		│ Production │ xxxxs2KwnRds65xxxxbp2GpYF78h3bxxxx1f-xxxx-xxxx-bba3-5a79beaxxxxd │
		├────────────┼──────────────────────────────────────────────────────────────────┤
		│ Staging    │ xxxxgs9s-QBRsxxxxGxxxxGGxxhxxxx467xf-xxx3-430a-bba3-5a7xxxx95xxx │
		└────────────┴──────────────────────────────────────────────────────────────────┘


## 公有雲的CodePush集成到新的iOS專案(OC)
1. 新建一個React Native專案

		react-native init codePushIntergradation

2. 在新建的React Native目錄下,使用npm安裝CodePush

		npm install --save react-native-code-push
		
3. 再run一次安裝

		npm install
		
4. 執行以下指令,會打開瀏覽器訪問M$的app center,按照步驟登入或是註冊

		> code-push register
		
5. 上面的步驟完畢,在瀏覽器中可以得到一串金鑰

		fxxxdd9caxxxxxxadxxxc3xxxc9904xxxd5xxx1x

6. 將金鑰輸入到終端機中,他會將session文件存在~/.code-push.config

		Successfully logged-in. 
		Your session file was written to /Users/userName/.code-push.config. 
		You can run the code-push logout command at any time to delete this file and terminate your session.

7. 接著輸入以下指令,證明你已經登入了

		> code-push login
		[Error]  You are already logged in from this machine.
		
8. 接著安裝幫原生的iOS/Android專案安裝CodePush的lib,deployment key先不用輸入,按Enter就好


		> react-native link react-native-code-push
		
		Scanning folders for symlinks in /Users/UserName/Project/IOS/CodePushIntergradation/node_modules (18ms)
		? What is your CodePush deployment key for Android (hit <ENTER> to ignore) 
		rnpm-install info Linking react-native-code-push android dependency 
		rnpm-install info Android module react-native-code-push has been successfully linked 
		rnpm-install info Linking react-native-code-push ios dependency 
		rnpm-install info iOS module react-native-code-push has been successfully linked 
		Running ios postlink script
		? What is your CodePush deployment key for iOS (hit <ENTER> to ignore) 
		Running android postlink script
		

9. 在iOS專案中,使用Source Code方式打開info.plist,在裡面新增or更改CodePushDeploymentKey這個key的值為向CodePush註冊的Staging key(在上面前置作業申請的)

		<?xml version="1.0" encoding="UTF-8"?>
		<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
		<plist version="1.0">
		<dict>
			...
			...
			<key>CodePushDeploymentKey</key>
			<string>iGexxx9s-Qxxx1xxxGkxxxGxxxhF3xxx67xx-xxxx-43xx-xxxx-xxxxxxx9xxxd</string>
		</dict>
		</plist>

10. 接著打開AppDelegate.m,可以看到以下程式碼,cli工具已經幫我們把RCTRootView(React Native JS的運行容器)更新的Code都寫好了

		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
		{
			...
			...
			#ifdef DEBUG
		        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
		    #else
		        jsCodeLocation = [CodePush bundleURL];
		    #endif
		    RCTRootView *rootView = 
		    [[RCTRootView alloc] 
		    initWithBundleURL:jsCodeLocation
				moduleName:@"codePushIntergradation"
				initialProperties:nil
				launchOptions:launchOptions];
		   ...
		   ...
	  	}

11. 接著我們還要設定iOS的http訪問權限,打開info.plist,把CodePush的Url加入進去

		<plist version="1.0">
		  <dict>
		    <!-- ...other configs... -->
		
		    <key>NSAppTransportSecurity</key>
		    <dict>
		      <key>NSExceptionDomains</key>
		      <dict>
		        <key>codepush.azurewebsites.net</key>
		        <dict><!-- read the ATS Apple Docs for available options --></dict>
		      </dict>
		    </dict>
		
		    <!-- ...other configs... -->
		  </dict>
		</plist>

12. 將React Native的index.js改成以下

		import { AppRegistry } from 'react-native';
		import App from './App';
		
		import codePush from "react-native-code-push";
		
		AppRegistry.registerComponent('codePushIntergradation', () => codePush(App));
		
13. 接著用Release模式Run,一定要Release喔,不然他只會讀local的js


14. xcode怎麼找到最新的React Native js的呢?因為Xcode裡,react-native cli工具幫我們配置了一個run script,可以切到以下地方,找到一個.sh的script,這個script會在Copy Bundle Resources之後將打包好的js放到ipa中(可以參考開頭參考的連結)

		點擊項目 -> TARGETS -> {{porject name}} -> BuildPhases ->Bundle React Native code and images

15. 接著修改React Native的app.js

		export default class App extends Component<Props> {
		  render() {
		    return (
		      <View style={styles.container}>
		        <Text style={styles.welcome}>
		         Hello code push!!
		        </Text>
		        <Text style={styles.instructions}>
		          To get started, edit App.js
		        </Text>
		        <Text style={styles.instructions}>
		          {instructions}
		        </Text>
		      </View>
		    );
		  }
		}

16. 接著要把React Native專案下的package.json版本號更新,不然不給上傳

		{
		  "name": "codePushIntergradation",
		  "version": "0.0.2",
		  "private": true,
		  "scripts": {
		    "start": "node node_modules/react-native/local-cli/cli.js start",
		    "test": "jest"
		  },
		  "dependencies": {
		    "react": "16.2.0",
		    "react-native": "0.53.0",
		    "react-native-code-push": "^5.2.1"
		  },
		  "devDependencies": {
		    "babel-jest": "22.2.0",
		    "babel-preset-react-native": "4.0.0",
		    "jest": "22.2.1",
		    "react-test-renderer": "16.2.0"
		  },
		  "jest": {
		    "preset": "react-native"
		  }
		}



16. 接著將寫好的js打包,並且發布到遠端Server上,這句command做兩個動作,打包React Native專案並且上傳到Code push
		
		> code-push release-react {{Your project name}} ios 
		
17. 重新打開app兩次(滑掉重開),然後可就可以看到更新,至於為什麼要兩次呢...?我猜是為了用戶體驗,第一次檢查到更新先存著,等到下一次再更新


## 常用指令

	初始化階段：
	1:npm install -g code-push-cli 安裝客戶端
	2:code-push -v 查看是否安裝成功
	3:code-push register 在codepush注冊賬號
	4:code-push login
	5:code-push app add <appName> <android/ios> react-native 添加app
	例如
	code-push app add test android react-native
	
	6:code-push app list 列出app列表
	code-push deployment ls <appName> -k 查看APP的key
	code-push deployment history <appName> Porduction/Staging
	例如：
	code-push deployment history test Production
	
	7:yarn add react-native-code-push 在rn項目下安裝codepush
	8:react-native link react-native-code-push 鏈接codepush




		