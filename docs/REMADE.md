### Lerna

- Lerna 是一个管理多个 npm 模块的工具,优化维护多包的工作流，解决多个包互相依赖，且发布需要手动维护多个包的问题

命令 功能
lerna bootstrap 安装依赖
lerna clean 删除各个包下的 node_modules
lerna init 创建新的 lerna 库
lerna list 查看本地包列表
lerna changed 显示自上次 release tag 以来有修改的包， 选项通 list
lerna diff 显示自上次 release tag 以来有修改的包的差异， 执行 git diff
lerna exec 在每个包目录下执行任意命令
lerna run 执行每个包 package.json 中的脚本命令
lerna add 添加一个包的版本为各个包的依赖
lerna import 引入 package
lerna link 链接互相引用的库
lerna create 新建 package
lerna publish 发布

#### yarn workspace

- yarn workspace 允许我们使用 monorepo 的形式来管理项目
- 在安装 node_modules 的时候它不会安装到每个子项目的 node_modules 里面，而是直接安装到根目录下面，这样每个子项目都可以读取到根目录的 node_modules
- 整个项目只有根目录下面会有一份 yarn.lock 文件。子项目也会被 link 到 node_modules 里面，这样就允许我们就可以直接用 import 导入对应的项目
- yarn.lock 文件是自动生成的,也完全 Yarn 来处理.yarn.lock 锁定你安装的每个依赖项的版本，这可以确保你不会意外获得不良依赖

作用 命令
查看工作空间信息 yarn workspaces info
给根空间添加依赖 yarn add chalk cross-spawn fs-extra --ignore-workspace-root-check
给某个项目添加依赖 yarn workspace create-react-app3 add commander
删除所有的 node_modules lerna clean 等于 yarn workspaces run clean
安装和 link yarn install 等于 lerna bootstrap --npm-client yarn --use-workspaces
重新获取所有的 node_modules yarn install --force
查看缓存目录 yarn cache dir
清除本地缓存 yarn cache clean
