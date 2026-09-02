# Prueba técnica — resumen

Tenía una hora de time cap y varias cosas que hacer. Los primeros diez o quince minutos los usé en revisar el código: entender qué había que hacer, cómo funcionaba, qué estaba pasando. Era una cosa pequeña, pero al final me quedaron unos cuarenta y tantos minutos efectivos.

A partir de ahí me dieron seis tareas: dos bugs, dos features, un PR y un análisis técnico de refactorización.

## Qué decidí hacer y por qué

No había KPIs ni ninguna métrica para decidir por dónde empezar, así que seguí mi propio criterio de priorización:

**Bug 1 — importación incorrecta de datos** ([PR #4](https://github.com/Genesy-AI/technical-task-ricardo/pull/4)). Decidí atacarlo primero porque, si se generan datos mal y quedan mal en base de datos, acabas teniendo que hacer una limpieza. Es un bug que se extiende: puedes meter clientes, mandatos y datos incorrectos. Lo hice para ahorrar problemas futuros.

**Bug 2 — falta de feedback al usuario en una validación** ([PR #3](https://github.com/Genesy-AI/technical-task-ricardo/pull/3)). Lo detecté justo mientras revisaba el código y decidí atacarlo porque me pareció fácil.

**Code review del PR.** Había dos PRs. Uno era un bump de versión que además arreglaba un leak de seguridad ([PR #1](https://github.com/Genesy-AI/technical-task-ricardo/pull/1)), así que a tope con ello. El otro era una feature nueva ([PR #2](https://github.com/Genesy-AI/technical-task-ricardo/pull/2)), hermana de una de las features que me pedían a mí.

¿Por qué priorizar el PR antes que mi propia feature? Porque así sacamos valor más rápido al usuario. Si me pongo a hacer mi feature y dejo el PR parado, perdemos velocidad de entrega. Es prioritario revisar los PRs para que las cosas vayan saliendo hacia los clientes.

Después del PR ya no me dio tiempo a más.

## Análisis técnico

No hay mucho test, o al menos no los suficientes para mi gusto. No voy a decir que sea espagueti, porque tampoco lo es: son controladores sencillos y el flujo se sigue bastante bien. Pero sí veo llamadas HTTP mezcladas con llamadas a base de datos, y llamadas a base de datos dentro de bucles, cuando en realidad habría que hacer un bulk.

Mi propuesta:

**Sacar el acceso a datos de donde está.** Las llamadas a base de datos tienen que vivir en otra capa, no ahí. Eso pasa por inversión de dependencias e inyección de dependencias. En general, todo SOLID: hay que darle cariño a esa parte. Ahora bien, esto depende de si queremos que escale de verdad o si con algún cambio puntual nos vale y tiramos para adelante.

**Testing.** Sobre todo esto. Montar una pirámide de testing: tests unitarios de absolutamente todo lo que se pueda —no hace falta el cien por cien de cobertura, pero sí una base sólida— e ir subiendo hacia tests funcionales y de aceptación.

**A más largo plazo.** Si queremos ir a algo más serio, yo estoy acostumbrado a trabajar con DDD y CQRS, así que intentaría ir por ahí. Pero eso ya requiere más tiempo: habría que definir una estructura común para que todos trabajemos igual, decidir qué dependencias usar para los buses, y montar algún tipo de caché para la generación automática de servicios. Todo eso lleva bastante más tiempo, pero se podría ir introduciendo poco a poco.
