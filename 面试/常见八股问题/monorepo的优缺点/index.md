Monorepo 其实不是一个新的概念，在软件工程领域，它已经有着十多年的历史了。概念上很好理解，就是把多个项目放在一个仓库里面，相对立的是传统的 MultiRepo 模式，即每个项目对应一个单独的仓库来分散管理。
一般 Monorepo 的目录如下所示，在 packages 存放多个子项目，并且每个子项目都有自己的 package.json:

```
├── packages
|   ├── pkg1
|   |   ├── package.json
|   ├── pkg2
|   |   ├── package.json
├── package.json
```

monorepo 的缺点

- 项目复杂度上去以后，仓库体积过于庞大
- 无法管理某个、某些项目对于指定人员的权限
- 不同分支下的版本控制会显得较为混乱
- 对于发布构建的挑战，难度会比单个项目构建要大
- 不适用于业务相对零散、项目之间关系不大的场景
