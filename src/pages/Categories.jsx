import categories from "../data/categories";

function Categories() {
  return (
    <div>
      <h1>AI Categories</h1>

      {categories.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <p>{category.description}</p>
          <span>{category.toolCount}</span>
        </div>
      ))}
    </div>
  );
}

export default Categories;