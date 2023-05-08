import plantumlEncoder from 'plantuml-encoder'

var encoded = plantumlEncoder.encode('A -> B: Hello plantuml')
// 后续可以完善流程图，每个流程图生成的code码是一致的，然后在markdown里使用图片渲染，可以不用图床
console.log(encoded)
