JWT 全称为 JsonWebToken

> 是一种在 cookie session 体系之后发展的校验方式。特点是 **无状态**

JWT 由三部分组成：Header.PayLoad.Signature

Header：声明要用什么算法生成签名

PayLoad：一些特定的数据，例如有效期（max-age）

Signature：保存在服务端的 `secret 密钥+Base64Url(Header)+Base64Url(PayLoad)`生成（加密算法由 Header 提供 ）

其中：Header 和 PayLoad 部分是由**Base64 编码**。注意是编码不是加密！很容易被破解（缺点之一）因此不要在其中存入敏感数据

## 缺点：

---

### 注销登录等场景下 JWT 还有效

与之类似的具体相关场景有：

退出登录;修改密码;注销账号;

这个问题不存在于 Session 认证方式中，因为在 Session 认证方式中，遇到这种情况的话服务端删除对应的 Session 记录即可。但是，使用 JWT 认证的方式就不好解决了。JWT 一旦派发出去，如果后端不增加其他逻辑的话，它在失效之前都是有效的。

那我们如何解决这个问题呢？查阅了很多资料，我简单总结了下面 4 种方案：

1、将 JWT 存入内存数据库
将 JWT 存入 DB 中，Redis 内存数据库在这里是不错的选择。如果需要让某个 JWT 失效就直接从 Redis 中删除这个 JWT 即可。但是，这样会导致每次使用 JWT 发送请求都要先从 DB 中查询 JWT 是否存在的步骤，而且违背了 JWT 的无状态原则。

2、黑名单机制
和上面的方式类似，使用内存数据库比如 Redis 维护一个黑名单，如果想让某个 JWT 失效的话就直接将这个 JWT 加入到 黑名单 即可。然后，每次使用 JWT 进行请求的话都会先判断这个 JWT 是否存在于黑名单中。

前两种方案的核心在于将有效的 JWT 存储起来或者将指定的 JWT 拉入黑名单。
虽然这两种方案都违背了 JWT 的无状态原则，但是一般实际项目中我们通常还是会使用这两种方案。

3、修改密钥 (Secret) :
我们为每个用户都创建一个专属密钥。

    例如把用户的密码作为密钥。

如果我们想让某个 JWT 失效，我们直接修改对应用户的密钥即可。但是，这样相比于前两种引入内存数据库带来了危害更大：

如果服务是分布式的，则每次发出新的 JWT 时都必须在多台机器同步密钥。为此，你需要将密钥存储在数据库或其他外部服务中，这样和 Session 认证就没太大区别了。

如果用户同时在两个浏览器打开系统，或者在手机端也打开了系统，如果它从一个地方将账号退出，那么其他地方都要重新进行登录，这是不可取的。

4、保持令牌的有效期限短并经常轮换
很简单的一种方式。但是，会导致用户登录状态不会被持久记录，而且需要用户经常登录。
另外，对于修改密码后 JWT 还有效问题的解决还是比较容易的。说一种我觉得比较好的方式：使用用户的密码的哈希值对 JWT 进行签名。因此，如果密码更改，则任何先前的令牌将自动无法验证。

### JWT 的续签问题

JWT 有效期一般都建议设置的不太长，那么 JWT 过期后如何认证，如何实现动态刷新 JWT，避免用户经常需要重新登录？

我们先来看看在 Session 认证中一般的做法：假如 Session 的有效期 30 分钟，如果 30 分钟内用户有访问，就把 Session 有效期延长 30 分钟。

JWT 认证的话，我们应该如何解决续签问题呢？

1. 类似于 Session 认证中的做法

这种方案满足于大部分场景。假设服务端给的 JWT 有效期设置为 30 分钟，服务端每次进行校验时，如果发现 JWT 的有效期马上快过期了，服务端就重新生成 JWT 给客户端。客户端每次请求都检查新旧 JWT，如果不一致，则更新本地的 JWT。这种做法的问题是仅仅在快过期的时候请求才会更新 JWT ,对客户端不是很友好。

2. 每次请求都返回新 JWT

这种方案的的思路很简单，但是，开销会比较大，尤其是在服务端要存储维护 JWT 的情况下。

3. JWT 有效期设置到半夜

这种方案是一种折衷的方案，保证了大部分用户白天可以正常登录，适用于对安全性要求不高的系统。
