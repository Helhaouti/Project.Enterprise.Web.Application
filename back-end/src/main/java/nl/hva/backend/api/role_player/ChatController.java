package nl.hva.backend.api.role_player;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.models.Chat;
import nl.hva.backend.services.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;


/**
 * End point of chat via websockets
 *
 * @author Hidde Balestra
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/gamechat")
public class ChatController {

  private final ChatService chatService;

  @PostMapping("/")
  public ResponseEntity<Chat> saveChatMessage(@RequestBody @Valid Chat chat) {
    Chat newChat = chatService.saveChat(chat);

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(newChat.getId())
      .toUri();

    return ResponseEntity.created(location).body(newChat);
  }

  @GetMapping("/{id}")
  public List<Chat> getChatMessage(@PathVariable int id) {
    return chatService.findAllWithSameGameId(id);
  }

  @DeleteMapping("/{id}")
  public int clearAllChatMessage(@PathVariable int id) {
    chatService.clearAllMessages(id);
    return id;
  }

}
