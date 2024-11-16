package nl.hva.backend.services;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.models.Chat;
import nl.hva.backend.repositories.ChatRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;


/**
 * A service for the chat.
 *
 * @author Hidde Balestra
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

  private final UserService userService;
  private final ChatRepository chatRepository;

  public Chat saveChat(Chat chat) {
    chat = new Chat(chat.getMessage(), chat.getTime(), chat.getGameId(), chat.getUser());
    return chatRepository.save(chat);
  }

  public List<Chat> findAllWithSameGameId(int id) {
    List<Chat> result = this.chatRepository.findAllChatsOf(id);

    for (Chat chat : result)
      chat.setUser(userService.findByUserName(chat.getUsername()));

    return result;
  }

  public void clearAllMessages(int id) {
    this.chatRepository.deleteAll(findAllWithSameGameId(id));
  }

}