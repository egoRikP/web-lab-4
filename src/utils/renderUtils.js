export function asList(list) {
  return (
    <ul>
      {list.map((element) => (
        <li key={element}>{element}</li>
      ))}
    </ul>
  );
}
