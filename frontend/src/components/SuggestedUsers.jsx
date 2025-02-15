import SuggestedUser from "./SuggestedUser";

const SuggestedUsers = ({ suggestedUsers }) => {
  return (
    <div className="flex flex-col gap-4 border-slate-200 p-4 border-2 rounded  ">
      <h3>Suggested Users</h3>
      {suggestedUsers?.length !== 0 &&
        suggestedUsers?.map((sugguser) => (
          <SuggestedUser key={sugguser._id} sugguser={sugguser} />
        ))}
    </div>
  );
};

export default SuggestedUsers;
