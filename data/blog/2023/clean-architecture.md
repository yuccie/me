---
title: '架构整洁之道'
date: Tue May 09 2023 00:32:34 GMT+0800 (中国标准时间)
lastmod: '2023-05-09'
tags: ['架构整洁之道', '设计原则', '依赖反转', '工厂模式', '里氏替换']
draft: false
summary: '软件架构的规则是相同的！！！'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/clean-architecture
---

## 前言


这篇文章是阅读 《架构整洁之道》 这本书的笔记，和自己的一些感想。

![哈哈](http://www.plantuml.com/plantuml/img/SrJGjLDmibBmICt9oGS0)

## 第一部分：概述

采用好的软件架构可以大大节省软件项目构建与维护的人力成本。让每次变更都短小简单，易于实施，并且避免缺陷，用最小的成本，最大程度地满足功能性和灵活性的要求。

### 第1章：设计与架构究竟是什么

设计(Design)与架构(Architecture)这两个概念让大多数人十分迷惑——什么是设计？什么是架构？二者究竟有什么区别？

- 架构：这个词往往使用于“高层级”的讨论中。**这类讨论一般都把“底层”的实现细节排除在外。**
- 设计：**往往用来指代具体的系统底层组织结构和实现的细节**

软件架构的终极目标是，用最小的人力成本来满足构建和维护该系统的需求。

工程师们经常相信的另外一个错误观点是：“在工程中容忍糟糕的代码存在可以在短期内加快该工程上线的速度，未来这些代码会造成一些额外的工作量，但是并没有什么大不了。”

相信这些鬼话的工程师对自己清理乱麻代码的能力过于自信了。但是更重要的是，他们还忽视了一个自然规律：无论是从短期还是长期来看，胡乱编写代码的工作速度其实比循规蹈矩更慢。

### 第2章：两个价值维度

#### 行为价值

软件系统的行为是其最直观的价值维度。程序员的工作就是让机器按照某种指定方式运转，给系统的使用者创造或者提高利润。

大部分程序员认为他们的工作是且仅是：按照需求文档编写代码，并且修复任何Bug。这真是大错特错。

#### 架构价值

软件系统的第二个价值维度，就体现在软件这个英文单词上：software。“ware”的意思是“产品”，而“soft”的意思，不言而喻，是指软件的灵活性。

软件系统必须保持灵活。**软件发明的目的，就是让我们可以以一种灵活的方式来改变机器的工作行为。对机器上那些很难改变的工作行为，我们通常称之为硬件(hardware)**。

从研发者角度来看，系统用户持续不断的变更需求就像是要求他们不停地用一堆不同形状的拼图块，拼成一个新的形状。整个拼图的过程越来越困难，因为现有系统的形状永远和需求的形状不一致。

我们在这里使用了“形状”这个词，这可能不是该词的标准用法，但是其寓意应该很明确。毕竟，软件工程师们经常会觉得自己的工作就是把方螺丝拧到圆螺丝孔里面。

问题的实际根源当然就是系统的架构设计。如果系统的架构设计偏向某种特定的“形状”，那么新的变更就会越来越难以实施。所以，好的系统架构设计应该尽可能做到与“形状”无关。

至于行为价值和架构价值，哪个性价比更好，那就要看可持续性的投入产出比了。

## 第二部分：从基础架构开始：编程范式

1938年，阿兰·图灵为现代计算机编程打下了地基。尽管他并不是第一个发明可编程机器的人，但却是第一个提出“程序即数据”的人。

到1945年时，图灵已经在真实计算机上编写真实的、我们现在也能看懂的计算机程序了。这些程序中用到了循环、分支、赋值、子调用、栈等如今我们都很熟悉的结构。而图灵用的编程语言就是简单的二进制数序列。

这期间，计算机编程领域还经历了另外一个更巨大、更重要的变革，那就是编程范式(paradigm)的变迁。**编程范式指的是程序的编写模式**，与具体的编程语言关系相对较小

### 第3章：编程范式总览

- 结构化编程(structured programming)
- 面向对象编程(object-oriented programming)
- 函数式编程(functional programming)

#### 结构化编程(structured programming)

结构化编程是第一个普遍被采用的编程范式（但是却不是第一个被提出的），由Edsger Wybe Dijkstra于1968年最先提出。

与此同时，Dijkstra还论证了使用goto这样的无限制跳转语句将会损害程序的整体结构。也是这位Dijkstra最先主张用我们现在熟知的if/then/else语句和do/while/until语句来代替跳转语句的。

**结构化编程对程序控制权的直接转移进行了限制和规范。**

#### 面向对象编程(object-oriented programming)

事实上，这个编程范式的提出比结构化编程还早了两年，是在1966年由Ole Johan Dahl和Kriste Nygaard在论文中总结归纳出来的。

这两个程序员注意到在ALGOL语言中，函数调用堆栈(call stack frame)可以被挪到堆内存区域里，这样函数定义的本地变量就可以在函数返回之后继续存在。

这个函数就成为了一个类(class)的构造函数，而它所定义的本地变量就是类的成员变量，构造函数定义的嵌套函数就成为了成员方法(method)。

这样一来，我们就可以利用多态(polymorphism)来限制用户对函数指针的使用。

**面向对象编程对程序控制权的间接转移进行了限制和规范。**

#### 函数式编程(functional programming)

尽管第三个编程范式是近些年才刚刚开始被采用的，但它其实是三个范式中最先被发明的。

事实上，函数式编程概念是基于与阿兰·图灵同时代的数学家Alonzo Church在1936年发明的λ演算的直接衍生物。

1958年John Mccarthy利用其作为基础发明了LISP语言。众所周知，λ演算法的一个核心思想是不可变性——某个符号所对应的值是永远不变的，所以从理论上来说，**函数式编程语言中应该是没有赋值语句的**。大部分函数式编程语言只允许在非常严格的限制条件下，才可以更改某个变量的值。

**函数式编程语言中应该是没有赋值语句的**


总结：
- 编程范式，它们都从某一方面限制和规范了程序员的能力。没有一个范式是增加新能力的。
- 也就是说，每个编程范式的目的都是设置限制。这些范式主要是为了告诉我们不能做什么，而不是可以做什么。
- 这三个编程范式分别限制了goto语句、函数指针和赋值语句的使用。


而编程范式与软件架构有关系吗？当然有：而且关系相当密切。譬如说，多态是我们跨越架构边界的手段，函数式编程是我们规范和限制数据存放位置与访问权限的手段，结构化编程则是各模块的算法实现基础。

这和软件架构的三大关注重点不谋而合：功能性、组件独立性以及数据管理。

### 第4章：结构化编程

- 可推导性：用代码将一些已证明可用的结构串联起来，只要自行证明这些额外代码是正确的，就可以推导出整个程序的正确性。
  - goto语句的某些用法会导致某个模块无法被递归拆分成更小的、可证明的单元，这会导致无法采用分解法来将大型问题进一步拆分成更小的、可证明的部分。
- 功能性降解拆分：既然结构化编程范式可将模块递归降解拆分为可推导的单元，这就意味着模块也可以按功能进行降解拆分。这样一来，我们就可以将一个大型问题拆分为一系列高级函数的组合，而这些高级函数各自又可以继续被拆分为一系列低级函数，如此无限递归。更重要的是，每个被拆分出来的函数也都可以用结构化编程范式来书写

结构化编程范式中最有价值的地方就是，它赋予了我们创造可证伪程序单元的能力。这就是为什么现代编程语言一般不支持无限制的goto语句。更重要的是，这也是为什么在架构设计领域，功能性降解拆分仍然是最佳实践之一。

### 第5章：面向对象编程

**面向对象编程是一种对真实世界进行建模的方式**，这种回答只能算作避重就轻。“对真实世界的建模”到底要如何进行？我们为什么要这么做，有什么好处？

- 封装：采用封装特性，我们可以把一组相关联的数据和函数圈起来，使圈外面的代码只能看见部分函数，数据则完全不可见
- 继承：可以在某个作用域内对外部定义的某一组变量与函数进行覆盖
- 多态：

C++通过在编程语言层面引入public、private、protected这些关键词，部分维护了封装性。但所有这些都是为了解决编译器自身的技术实现问题而引入的hack——编译器由于技术实现原因必须在头文件中看到成员变量的定义

面向对象编程在应用上确实会要求程序员尽量避免破坏数据的封装性。但实际情况是，那些声称自己提供面向对象编程支持的编程语言，相对于C这种完美封装的语言而言，其封装性都被削弱了，而不是加强了。

面向对象编程就是以多态为手段来对源代码中的依赖关系进行控制的能力，这种能力让软件架构师可以构建出某种插件式架构，让高层策略性组件与底层实现性组件相分离，底层组件可以被编译成插件，实现独立于高层组件的开发和部署。

### 第6章：函数式编程

为什么不可变性是软件架构设计需要考虑的重点呢？为什么软件架构师要操心变量的可变性呢？

答案显而易见：所有的竞争问题、死锁问题、并发更新问题都是由可变变量导致的。如果变量永远不会被更改，那就不可能产生竞争或者并发更新问题。如果锁状态是不可变的，那就永远不会产生死锁问题。

换句话说，一切并发应用遇到的问题，一切由于使用多线程、多处理器而引起的问题，如果没有可变变量的话都不可能发生。（这里和项目中，某个变量被很多地方修改是不同，因为js是单线程，只是物理上感觉，很多地方在同时修改）

#### 可变性的隔离

一种常见方式是将应用程序，或者是应用程序的内部服务进行切分，划分为可变的和不可变的两种组件。

不可变组件用纯函数的方式来执行任务，期间不更改任何状态。这些不可变的组件将通过与一个或多个非函数式组件通信的方式来修改变量状态

由于状态的修改会导致一系列并发问题的产生，所以我们通常会采用某种**事务型内存**来保护可变变量，避免同步更新和竞争状态的发生。

> 事务性内存（Transactional Memory，TM）是一种并发控制机制，旨在简化多线程编程，使程序员能够编写并发代码，而无需显式地锁定共享数据。事务性内存提供了一种类似于数据库事务的机制，允许多个线程同时执行一组操作，这些操作被视为一个原子操作。如果事务执行成功，则所有操作将被提交，否则它们将被回滚。事务性内存旨在提高并发性能和可伸缩性，并减少编程错误和死锁问题的可能性。

一个架构设计良好的应用程序应该将状态修改的部分和不需要修改状态的部分隔离成单独的组件，然后用合适的机制来保护可变量。软件架构师应该着力于将大部分处理逻辑都归于不可变组件中，可变状态组件的逻辑应该越少越好。

#### 事件溯源

随着存储和处理能力的大幅进步，现在拥有每秒可以执行数十亿条指令的处理器，以及数十亿字节内存的计算机已经很常见了。而内存越大，处理速度越快，我们对可变状态的依赖就会越少。

> 内存越大，处理速度越快，这意味着我们可以更快地读取和处理数据，从而减少了等待时间和处理时间。这也意味着我们可以更快地执行计算和操作，从而减少了处理数据时需要依赖可变状态的情况，但这是趋势，程序的设计和算法的优化等因素都会影响可变状态的依赖程度。

举个简单的例子，假设某个银行应用程序需要维护客户账户余额信息，当它执行存取款事务时，就要同时负责修改余额记录。

如果我们不保存具体账户余额，仅仅保存事务日志，那么当有人想查询账户余额时，我们就将全部交易记录取出，并且每次都得从最开始到当下进行累计。当然，这样的设计就不需要维护任何可变变量了。

但显而易见，这种实现是有些不合理的。因为随着时间的推移，事务的数目会无限制增长，每次处理总额所需要的处理能力很快就会变得不能接受。如果想使这种设计永远可行的话，我们将需要无限容量的存储，以及无限的处理能力。

但是可能我们并不需要这个设计永远可行，而且可能在整个程序的生命周期内，我们有足够的存储和处理能力来满足它。

这就是事件溯源，在这种体系下，我们只存储事务记录，不存储具体状态。当需要具体状态时，我们只要从头开始计算所有的事务即可。

在存储方面，这种架构的确需要很大的存储容量。如今离线数据存储器的增长是非常快的，现在1 TB对我们来说也已经不算什么了。

更重要的是，这种数据存储模式中不存在删除和更新的情况，我们的应用程序不是CRUD，而是CR。因为更新和删除这两种操作都不存在了，自然也就不存在并发问题。

如果我们有足够大的存储量和处理能力，应用程序就可以用完全不可变的、纯函数式的方式来编程。

总结：
- 这三个编程范式都对程序员提出了新的限制。每个范式都约束了某种编写代码的方式，没有一个编程范式是在增加新能力。
- 而我们过去很多年学到的，不是应该做什么，而是应该不做什么。
- 软件，或者说计算机程序无一例外是由顺序结构、分支结构、循环结构和间接转移这几种行为组合而成的，无可增加，也缺一不可。

## 第二部分：设计原则

通常来说，要想构建一个好的软件系统，应该从写整洁的代码开始做起。

毕竟，如果建筑所使用的砖头质量不佳，那么架构所能起到的作用也会很有限。反之亦然，如果建筑的架构设计不佳，那么其所用的砖头质量再好也没有用。这就是SOLID设计原则所要解决的问题。

SOLID原则一组面向对象设计原则，主要作用就是告诉我们如何将数据和函数组织成为类，以及如何将这些类链接起来成为程序，旨在帮助开发人员编写可维护和可扩展的代码

- 单一职责原则（SRP）：一个类应该只有一个职责，即只有一个原因需要进行修改。
- 开放封闭原则（OCP）：软件实体应该对扩展开放，对修改关闭。即可通过新增代码来实现更改，而非修改原来的代码
- 里氏替换原则（LSP）：子类必须能够替换其父类，而不会影响程序的正确性。
- 接口隔离原则（ISP）：客户端不应该依赖于它不需要的接口，一个类应该只提供客户端需要的接口。在设计中避免不必要的依赖。
- 依赖倒置原则（DIP）：高层模块不应该依赖于低层模块，它们应该依赖于抽象接口。抽象不应该依赖于具体实现，具体实现应该依赖于抽象。

这些原则有助于开发人员编写具有高内聚性和低耦合度的代码，从而提高代码的可维护性和可扩展性。

### 第7章：SRP（Single Responsibility Principle）单一职责原则

很多程序员根据SRP这个名字想当然地认为这个原则就是指：每个模块都应该只做一件事。但其实这只是 SRP 的一部分。

正确的是：任何一个软件模块都应该有且仅有一个被修改的原因。即：任何一个软件模块都应该只对某一类行为者负责。

通俗的说，其实不是单单只做一件事，而是这一类事情，都放在一块，这样相互间不会影响，比如用户管理、订单管理、商品管理等，需要分隔开。

### 第8章：OCP（Open Close Priciple）开闭原则

设计良好的计算机软件应该易于扩展，同时抗拒修改

换句话说，一个设计良好的计算机系统应该在不需要修改的前提下就可以轻易被扩展。

软件架构师可以根据相关函数被修改的原因、修改的方式及修改的时间来对其进行分组隔离，并将这些互相隔离的函数分组整理成组件结构，使得高阶组件不会因低阶组件被修改而受到影响。

### 第9章：LSP（iskov Substitution Principle）里氏替换原则

在面向对象这场编程革命兴起的早期，我们的普遍认知正如上文所说，认为LSP只不过是指导如何使用继承关系的一种方法，然而随着时间的推移，LSP逐渐演变成了一种更广泛的、指导接口与其实现方式的设计原则。

里氏替换原则指的是：**如果一个父类可以被子类继承，那么在程序中可以使用父类类型的地方，都可以使用子类类型来代替，而且程序的行为不应该发生变化。**

这个原则的核心是：子类不应该重写父类的方法，而是应该通过扩展父类的方法来实现自己的需求。如果子类重写了父类的方法，那么就可能破坏原有的程序逻辑，导致程序出现不可预期的行为。

理解这个原则的关键在于，父类和子类之间应该是一种“is-a”的关系，也就是说，子类应该是父类的一种类型。如果这种关系不成立，那么就不应该使用继承来实现。

总之，里氏替换原则是面向对象编程中非常重要的一个原则，它可以帮助我们设计出更加健壮和可扩展的程序。

### 第10章：ISP（Interface Segregation Principle）接口隔离原则

客户端不应该被迫依赖于它不使用的接口。

简单来说，就是要将一个接口拆分成多个更小的接口，每个接口只包含客户端需要的方法，避免客户端依赖不需要的方法，从而降低耦合度，提高代码的可维护性和可扩展性。

举个例子，假设有一个电视机类，它有打开、关闭、调节音量、调节频道等多个方法。如果我们将这些方法都放在一个接口中，那么客户端在使用这个接口时就必须依赖所有这些方法，即使它只需要使用其中的一部分。

这样就会导致代码的耦合度过高，不利于代码的维护和扩展。

因此，我们可以将这些方法拆分成多个接口，比如一个打开和关闭电视的接口、一个调节音量的接口、一个调节频道的接口等，客户端只需要依赖自己需要的接口即可，这样就能够遵循 ISP 接口隔离原则了。

### 第11章：DIP (Dependency Inversion Principle) 依赖反转原则

它主要是指高层模块不应该依赖低层模块，而是应该依赖于抽象接口。具体来说，DIP 要求：

- 高层模块不应该直接依赖低层模块，而是应该通过抽象接口来进行依赖。
- 抽象接口不应该依赖具体实现，而是应该由具体实现来依赖抽象接口。

这个原则的目的是提高代码的灵活性和可维护性。通过将依赖关系从具体实现中解耦出来，可以使得系统更容易进行扩展和修改，同时也可以降低代码之间的耦合度，提高代码的可测试性和可重用性。

举个例子，假设我们有一个系统，其中有一个高层模块 A，依赖于低层模块 B。

如果 A 直接依赖于 B，那么当我们需要更换 B 的实现时，就需要修改 A 的代码，这会增加代码的复杂度和维护成本。

但是如果我们将 A 依赖的接口抽象出来，让 B 实现这个接口，那么 A 就只需要依赖于这个接口，而不需要知道具体实现。这样当我们需要更换 B 的实现时，只需要更换实现就可以了，A 的代码不需要做任何修改。


如下示例中，底层组件是 DataProvider，它实现了抽象接口 IDataProvider。高层组件是 DataProcessor，它依赖于抽象接口 IDataProvider 而不是具体的底层组件 DataProvider。
```js
// 定义抽象接口
class IDataProvider {
  getData() {}
}

// 定义底层组件
class DataProvider {
  getData() {
    return [1, 2, 3];
  }
}

// 定义高层组件
class DataProcessor {
  constructor(dataProvider) {
    this.dataProvider = dataProvider;
  }

  processData() {
    const data = this.dataProvider.getData();
    return data.map((item) => item * 2);
  }
}

// 创建实例
const dataProvider = new DataProvider();
const dataProcessor = new DataProcessor(dataProvider);

// 使用高层组件处理数据
console.log(dataProcessor.processData());
```
如果需要更换底层组件，只需要实现抽象接口并传递给高层组件即可。这种方式也使得单元测试更加容易，因为可以通过模拟抽象接口来测试高层组件的逻辑。

如果不适用依赖反转的话，则需要直接在高层组件中使用底层组件，进行了强耦合。
```js
// 定义底层组件
class DataProvider {
    getData() {
        return [1, 2, 3];
    }
}

// 定义高层组件
class DataProcessor {
    processData() {
        const dataProvider = new DataProvider();
        const data = dataProvider.getData();
        return data.map((item) => item * 2);
    }
}

// 创建实例
const dataProcessor = new DataProcessor();

// 使用高层组件处理数据
console.log(dataProcessor.processData());
```

- 稳定的抽象层
  - 我们每次修改抽象接口的时候，一定也会去修改对应的具体实现。但反过来，当我们修改具体实现时，却很少需要去修改相应的抽象接口。所以我们可以认为接口比实现更稳定。
  - 也就是说，如果想要在软件架构设计上追求稳定，就必须多使用稳定的抽象接口，少依赖多变的具体实现
  - 应在代码中多使用抽象接口，尽量避免使用那些多变的具体实现类。
  - 应在代码中多使用抽象接口，尽量避免使用那些多变的具体实现类。

#### 工厂模式

在大部分面向对象编程语言中，人们都会选择用抽象工厂模式来解决这个源代码依赖的问题。那什么是工厂模式？

工厂模式是一种创建型设计模式，它提供了一种创建对象的最佳方式。

它的主要目的是将对象的创建过程封装起来，并且将其与客户端代码分离开来。

工厂模式有三种主要形式：
- 简单工厂模式：一个工厂类负责创建多个不同类型的对象。
- 工厂方法模式：每个具体的工厂类都负责创建一种类型的对象
- 抽象工厂模式：一个工厂类负责创建一组相关的对象

简单工厂模式示例：
```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}

class Cat extends Animal {
  speak() {
    console.log(`${this.name} meows.`);
  }
}

class AnimalFactory {
  createAnimal(type, name) {
    switch (type) {
      case "dog":
        return new Dog(name);
      case "cat":
        return new Cat(name);
      default:
        throw new Error("Invalid animal type.");
    }
  }
}

const animalFactory = new AnimalFactory();
const dog = animalFactory.createAnimal("dog", "Rufus");
const cat = animalFactory.createAnimal("cat", "Fluffy");

dog.speak(); // Rufus barks.
cat.speak(); // Fluffy meows.
```

工厂方法模式示例：
```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}

class Cat extends Animal {
  speak() {
    console.log(`${this.name} meows.`);
  }
}

class AnimalFactory {
  createAnimal(name) {
    throw new Error("Abstract method.");
  }
}

class DogFactory extends AnimalFactory {
  createAnimal(name) {
    return new Dog(name);
  }
}

class CatFactory extends AnimalFactory {
  createAnimal(name) {
    return new Cat(name);
  }
}

const dogFactory = new DogFactory();
const catFactory = new CatFactory();

const dog = dogFactory.createAnimal("Rufus");
const cat = catFactory.createAnimal("Fluffy");

dog.speak(); // Rufus barks.
cat.speak(); // Fluffy meows.
```

抽象工厂模式：
```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}

class Cat extends Animal {
  speak() {
    console.log(`${this.name} meows.`);
  }
}

class AnimalFactory {
  createDog(name) {
    throw new Error("Abstract method.");
  }

  createCat(name) {
    throw new Error("Abstract method.");
  }
}

class PetStore {
  constructor(animalFactory) {
    this.animalFactory = animalFactory;
  }

  buyDog(name) {
    const dog = this.animalFactory.createDog(name);
    console.log(`Bought a dog named ${name}.`);
    return dog;
  }

  buyCat(name) {
    const cat = this.animalFactory.createCat(name);
    console.log(`Bought a cat named ${name}.`);
    return cat;
  }
}

class DogFactory extends AnimalFactory {
  createDog(name) {
    return new Dog(name);
  }

  createCat(name) {
    throw new Error("Cannot create cats with a dog factory.");
  }
}

class CatFactory extends AnimalFactory {
  createDog(name) {
    throw new Error("Cannot create dogs with a cat factory.");
  }

  createCat(name) {
    return new Cat(name);
  }
}

const dogFactory = new DogFactory();
const catFactory = new CatFactory();

const petStore1 = new PetStore(dogFactory);
const petStore2 = new PetStore(catFactory);

const dog = petStore1.buyDog("Rufus");
const cat = petStore2.buyCat("Fluffy");

dog.speak(); // Rufus barks.
cat.speak(); // Fluffy meows.
```

### 第10章：ISP（Interface Segregation Principle）接口隔离原则
### 第10章：ISP（Interface Segregation Principle）接口隔离原则
### 第10章：ISP（Interface Segregation Principle）接口隔离原则