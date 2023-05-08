import plantUmlEncoder from 'plantuml-encoder'

const encoded = plantUmlEncoder.encode('A -> B: Hello plantuml')
console.log(encoded)

export default function PlantumlServer() {
  return 'hello plantuml'
}
