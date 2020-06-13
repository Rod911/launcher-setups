export const postsState = [];

export const postReducer = (state, action) => {
	switch (action.type) {
		case 'LOAD': return action.payload;
		case 'DELETE': return state.filter((v) => v._id !== action.payload);
		default: break;
	}
	return state;
};
