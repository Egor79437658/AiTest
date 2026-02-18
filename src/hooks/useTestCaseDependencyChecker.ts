import { useTestCase } from '@contexts/'
import { TestCase } from '@interfaces/'

export const useTestCaseDependencyChecker = () => {
  const { allTestCases } = useTestCase()

  const findTestCase = (id: number): TestCase => {
    const testCase = allTestCases.find((el) => el.id === id)
    if (!testCase) {
      console.log(allTestCases, id)
      throw new Error(`test case id ${id} not found`)
    }
    return testCase
  }

  const checkDependencies = (
    prevCasesIds: number[],
    errorOnMissingDependency: boolean = false
  ): number[] => {
    const dependencies: number[] = []
    const nameMap: { [key: number]: string } = {}
    let index = -1

    while (true) {
      ++index
      if (index >= prevCasesIds.length) break
      //   if(index > 1000) break
      if (prevCasesIds[index] === -1) continue

      const newCase = findTestCase(prevCasesIds[index])
      nameMap[prevCasesIds[index]] = newCase.name

      if (newCase.precondition === -1) continue

      let flag = false
      for (let i = 0; i < index; ++i) {
        if (prevCasesIds[i] === newCase.precondition) {
          flag = true
          break
        }
      }
      if (flag) continue
      else {
        if (errorOnMissingDependency) {
          throw new Error(
            'нарушение предусловий: ' +
            `${nameMap[newCase.precondition] || findTestCase(newCase.precondition).name}` +
            ` => ${newCase.name}`
          )
        }

        const dependencyIndex = dependencies.findIndex(
          (el) => el === newCase.precondition
        )
        if (dependencyIndex !== -1) {
          const message =
            'зацикливание предусловий: ' +
            `${newCase.name} => ` +
            dependencies
              .slice(dependencyIndex)
              .map((el) => `${nameMap[el] || findTestCase(el).name}`)
              .join(' => ')
          throw new Error(message)
        }
        prevCasesIds.splice(index, 0, newCase.precondition)
        dependencies.push(newCase.precondition)
        --index
      }
    }

    console.log(prevCasesIds)
    return prevCasesIds
  }

  return { checkDependencies }
}
