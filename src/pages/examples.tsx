const Examples = () => (
  <div className="max-w-6xl m-auto text-snow text-xl mt-10">
    <div className="flex justify-center">
      <h1 className="text-3xl mx-auto">Google Sheets</h1>
    </div>
    <br />
    <video controls>
      <source src="https://user-images.githubusercontent.com/729374/163003767-1540179a-580f-4017-8cd2-f2a094415bb7.mp4" />
    </video>
    <br />

    <div className="flex justify-center">
      <h1 className="text-3xl mx-auto">Airtable</h1>
    </div>
    <br />
    <video controls>
      <source src="https://user-images.githubusercontent.com/729374/163004936-2abc8403-04af-42cb-a55a-3a258d25a0e2.mp4" />
    </video>
    <br />

    <div className="flex flex-col justify-center">
      <h1 className="text-3xl mx-auto">Mixed</h1>
      <p className="text-center mt-2">
        You can mix Google Sheets and Airtable sources.
        <br />
        You can have few sheets / tables at the same time as sources, just divided by `,` (comma).
      </p>
    </div>
    <br />
  </div>
);

export default Examples;
